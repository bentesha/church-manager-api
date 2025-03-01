import { Injectable } from '@nestjs/common';
import findQuery from 'objection-find';
import { SessionRow } from 'src/data/session.row';
import { DateHelper } from 'src/helpers/date.helper';
import { IdHelper } from 'src/helpers/id.helper';
import { Session } from 'src/models/session.model';
import * as crypto from 'crypto';

export interface CreateSessionInfo {
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date | string;
}

@Injectable()
export class SessionService {
  constructor(
    private readonly idHelper: IdHelper,
    private readonly dateHelper: DateHelper,
  ) {}

  /**
   * Finds a session by its ID.
   * @param id - The session ID.
   * @returns The session record or undefined if not found.
   */
  async findById(id: string): Promise<Session | undefined> {
    return Session.query().findById(id);
  }

  /**
   * Finds a single session matching the provided query.
   * @param query - Partial session properties to search for.
   * @returns The first matching session or undefined.
   */
  async findOne(query: Partial<SessionRow>): Promise<Session | undefined> {
    return findQuery(Session).allowAll(true).build(query).first();
  }

  /**
   * Finds all sessions matching the given query.
   * @param query - Partial session properties to filter results.
   * @returns A list of matching sessions.
   */
  async findAll(query: Partial<SessionRow>): Promise<Array<Session>> {
    return findQuery(Session).allowAll(true).build(query);
  }

  /**
   * Creates a new session.
   * @param info - The session details to be saved.
   * @returns The created session record.
   */
  async create(info: CreateSessionInfo): Promise<Session> {
    const timestamp = this.dateHelper.formatDateTime();
    const token = crypto.randomBytes(32).toString('hex');

    const row: SessionRow = {
      token,
      id: this.idHelper.generate(),
      userId: info.userId,
      ipAddress: info.ipAddress ?? null,
      userAgent: info.userAgent ?? null,
      createdAt: timestamp,
      updatedAt: timestamp,
      expiresAt: info.expiresAt,
      isActive: true,
    };
    await Session.query().insert(row);
    return (await this.findById(row.id))!;
  }

  /**
   * Deactivates a session by setting isActive to false.
   * @param id - The session ID.
   * @returns The updated session record or undefined if not found.
   */
  async deactivate(id: string): Promise<Session | undefined> {
    await Session.query().where({ id }).update({
      isActive: false,
      updatedAt: this.dateHelper.formatDateTime(),
    });
    return this.findById(id);
  }

  async deactivateAll(userId: string) {
    await Session.query().where({ userId }).update({
      isActive: false,
    });
  }

  /**
   * Deletes a session permanently.
   * @param id - The session ID.
   * @returns The deleted session record or undefined if not found.
   */
  async delete(id: string): Promise<Session | undefined> {
    const session = await this.findById(id);
    if (!session) return undefined;
    await Session.query().deleteById(id);
    return session;
  }
}
