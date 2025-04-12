// envelope.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import findQuery from 'objection-find';
import { EnvelopeRow } from 'src/data/envelope.row';
import { EnvelopeAssignment } from 'src/models/envelope.assignment.model';
import { DateHelper } from 'src/helpers/date.helper';
import { IdHelper } from 'src/helpers/id.helper';
import { Envelope } from 'src/models/envelope.model';
import { Member } from 'src/models/member.model';

export interface CreateEnvelopeBlockInfo {
  churchId: string;
  startNumber: number;
  endNumber: number;
}

@Injectable()
export class EnvelopeService {
  constructor(
    private readonly idHelper: IdHelper,
    private readonly dateHelper: DateHelper,
  ) {}

  /**
   * Finds an envelope by its ID.
   * @param id - The envelope's unique identifier.
   * @returns The envelope record or undefined if not found.
   */
  async findById(id: string): Promise<Envelope | undefined> {
    return Envelope.query().withGraphFetched('member').findById(id);
  }

  /**
   * Finds all envelopes that match the given query.
   * @param query - Partial properties to filter results.
   * @returns A list of matching envelopes.
   */
  async findAll(query: Partial<EnvelopeRow>): Promise<Array<Envelope>> {
    return findQuery(Envelope)
      .allowAll(true)
      .allowEager('[member, history]')!
      .build(query);
  }

  /**
   * Finds a single envelope by its number.
   * @param envelopeNumber - The envelope number.
   * @param churchId - The church ID.
   * @returns The envelope record or undefined if not found.
   */
  async findByNumber(
    envelopeNumber: number,
    churchId: string,
  ): Promise<Envelope | undefined> {
    return Envelope.query().where({ envelopeNumber, churchId }).first();
  }

  /**
   * Checks if there are any overlapping envelope numbers in the given range.
   * @param startNumber - The start of the range (inclusive).
   * @param endNumber - The end of the range (inclusive).
   * @param churchId - The church ID.
   * @returns True if there are overlaps, false otherwise.
   */
  async hasOverlappingNumbers(
    startNumber: number,
    endNumber: number,
    churchId: string,
  ): Promise<boolean> {
    const overlaps: any = await Envelope.query()
      .where('churchId', churchId)
      .where('envelopeNumber', '>=', startNumber)
      .where('envelopeNumber', '<=', endNumber)
      .count('* as count')
      .first();

    return overlaps?.count || 0 > 0;
  }

  /**
   * Creates a block of envelope records in the database.
   * @param info - The envelope block details.
   * @returns The number of envelopes created.
   */
  async createBlock(info: CreateEnvelopeBlockInfo): Promise<number> {
    if (info.startNumber > info.endNumber) {
      throw new BadRequestException(
        'Start number must be less than or equal to end number',
      );
    }

    // Check for overlaps
    const hasOverlaps = await this.hasOverlappingNumbers(
      info.startNumber,
      info.endNumber,
      info.churchId,
    );

    if (hasOverlaps) {
      throw new BadRequestException(
        'Envelope number range overlaps with existing envelopes',
      );
    }

    const timestamp = this.dateHelper.formatDateTime();
    let createdCount = 0;

    // Use Knex directly for batch insertion
    await Envelope.knex().transaction(async (trx) => {
      // Prepare all envelope records
      const envelopes: Array<EnvelopeRow> = [];
      for (let num = info.startNumber; num <= info.endNumber; num++) {
        envelopes.push({
          id: this.idHelper.generate(),
          envelopeNumber: num.toString(),
          churchId: info.churchId,
          memberId: null,
          assignedAt: null,
          releasedAt: null,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }

      createdCount = envelopes.length;

      // Use Knex directly for more efficient batch insertion
      // Break into chunks of 500 to avoid issues with very large inserts
      const chunkSize = 500;
      for (let i = 0; i < envelopes.length; i += chunkSize) {
        const chunk = envelopes.slice(i, i + chunkSize);
        await trx.batchInsert('envelopes', chunk);
      }
    });

    return createdCount;
  }

  /**
   * Checks if any envelope in the given range has ever been assigned to a member.
   * @param startNumber - The start of the range (inclusive).
   * @param endNumber - The end of the range (inclusive).
   * @param churchId - The church ID.
   * @returns True if any envelope has been assigned, false otherwise.
   */
  async hasAnyAssignmentHistory(
    startNumber: number,
    endNumber: number,
    churchId: string,
  ): Promise<boolean> {
    // Get all envelope IDs in the range
    const envelopes = await Envelope.query()
      .select('id')
      .where('churchId', churchId)
      .where('envelopeNumber', '>=', startNumber)
      .where('envelopeNumber', '<=', endNumber);

    if (envelopes.length === 0) {
      return false;
    }

    const envelopeIds = envelopes.map((e) => e.id);

    // Check if any of these envelopes has assignment history
    const assignmentCount: any = await EnvelopeAssignment.query()
      .whereIn('envelopeId', envelopeIds)
      .count('* as count')
      .first();

    return (Number(assignmentCount?.count) || 0) > 0;
  }

  /**
   * Deletes a block of envelope records from the database.
   * @param startNumber - The start of the range (inclusive).
   * @param endNumber - The end of the range (inclusive).
   * @param churchId - The church ID.
   * @returns The number of envelopes deleted.
   */
  async deleteBlock(
    startNumber: number,
    endNumber: number,
    churchId: string,
  ): Promise<number> {
    // Delete envelopes in the range
    const result = await Envelope.query()
      .where('churchId', churchId)
      .where('envelopeNumber', '>=', startNumber)
      .where('envelopeNumber', '<=', endNumber)
      .delete();

    return result;
  }

  /**
   * Finds the next 10 available envelopes (not assigned to any member).
   * @param churchId - The church ID to find available envelopes for.
   * @returns A list of available envelopes.
   */
  async findAvailable(churchId: string): Promise<Array<Envelope>> {
    return Envelope.query()
      .where({ churchId, memberId: null })
      .orderBy('envelopeNumber', 'asc')
      .limit(10);
  }

  /**
   * Assigns an envelope to a member.
   * @param envelopeId - The envelope ID to assign.
   * @param memberId - The member ID to assign the envelope to.
   * @param churchId - The church ID for tracking.
   * @returns The updated envelope record.
   */
  async assignToMember(
    envelopeId: string,
    memberId: string,
  ): Promise<Envelope | undefined> {
    // Transaction to ensure both envelope update and assignment history are recorded
    return Envelope.transaction(async (trx) => {
      const now = this.dateHelper.formatDateTime();

      const envelope = await Envelope.query(trx).findById(envelopeId);
      if (!envelope) {
        return;
      }

      // Update envelope
      await Envelope.query(trx).where({ id: envelopeId }).update({
        memberId,
        assignedAt: now,
        releasedAt: null,
        updatedAt: now,
      });

      // Record assignment in history
      await EnvelopeAssignment.query(trx).insert({
        id: this.idHelper.generate(),
        envelopeId,
        churchId: envelope.churchId,
        memberId,
        activityType: 'ASSIGNMENT',
        activityAt: now,
        createdAt: now,
        updatedAt: now,
      });

      Member.query(trx).where({ id: memberId }).update({
        envelopeNumber: envelope.envelopeNumber,
      });

      return (await Envelope.query(trx).findById(envelopeId))!;
    });
  }

  /**
   * Releases an envelope from a member.
   * @param envelopeId - The envelope ID to release.
   * @param churchId - The church ID for tracking.
   * @returns The updated envelope record.
   */
  async releaseFromMember(
    envelopeId: string,
    churchId: string,
  ): Promise<Envelope | undefined> {
    return Envelope.transaction(async (trx) => {
      const now = this.dateHelper.formatDateTime();

      // Get current member ID before releasing
      const envelope = await Envelope.query(trx).findById(envelopeId);
      if (!envelope) {
        return;
      }
      const formerMemberId = envelope.memberId;

      if (!formerMemberId) {
        // The envelope is currently not assigned
        return envelope;
      }

      // Update envelope - set releasedAt and clear memberId
      await Envelope.query(trx).where({ id: envelopeId }).update({
        memberId: null,
        assignedAt: null,
        releasedAt: now, // Set releasedAt to the current timestamp
        updatedAt: now,
      });

      // Record release in history
      await EnvelopeAssignment.query(trx).insert({
        id: this.idHelper.generate(),
        envelopeId,
        churchId,
        memberId: formerMemberId,
        activityType: 'RELEASE',
        activityAt: now,
        createdAt: now,
        updatedAt: now,
      });

      Member.query(trx)
        .where({ id: formerMemberId })
        .update({ envelopeNumber: null });

      return (await Envelope.query(trx).findById(envelopeId))!;
    });
  }

  /**
   * Gets the assignment history for an envelope.
   * @param envelopeId - The envelope ID to get history for.
   * @returns A list of assignment history records.
   */
  async getAssignmentHistory(
    envelopeId: string,
  ): Promise<Array<EnvelopeAssignment>> {
    return EnvelopeAssignment.query()
      .where({ envelopeId })
      .withGraphFetched('[member]')
      .orderBy('activityAt', 'desc');
  }
}
