import { Injectable } from '@nestjs/common';
import findQuery from 'objection-find';
import { FellowshipRow } from 'src/data/fellowship.row';
import { DateHelper } from 'src/helpers/date.helper';
import { IdHelper } from 'src/helpers/id.helper';
import { Fellowship } from 'src/models/fellowship.model';

export interface CreateFellowshipInfo {
  churchId: string;
  name: string;
  notes?: string | null;
  // Leadership roles are not included in creation
  // as members need to be created and assigned to the fellowship first
}

export interface UpdateFellowshipInfo {
  churchId?: string;
  name?: string;
  notes?: string | null;
  chairmanId?: string | null;
  deputyChairmanId?: string | null;
  secretaryId?: string | null;
  treasurerId?: string | null;
}

@Injectable()
export class FellowshipService {
  constructor(
    private readonly idHelper: IdHelper,
    private readonly dateHelper: DateHelper,
  ) {}

  /**
   * Finds a fellowship by its ID.
   * @param id - The fellowship's unique identifier.
   * @returns The fellowship record or undefined if not found.
   */
  async findById(id: string): Promise<Fellowship | undefined> {
    return Fellowship.query()
      .findById(id)
      .withGraphFetched('[chairman, deputyChairman, secretary, treasurer]');
  }

  /**
   * Finds a single fellowship matching the provided query.
   * @param query - Partial properties to search for.
   * @returns The first matching fellowship or undefined.
   */
  async findOne(
    query: Partial<FellowshipRow>,
  ): Promise<Fellowship | undefined> {
    return findQuery(Fellowship)
      .allowEager('[chairman, deputyChairman, secretary, treasurer]')!
      .allowAll(true)
      .build(query)
      .first();
  }

  /**
   * Finds all fellowships that match the given query.
   * @param query - Partial properties to filter results.
   * @returns A list of matching fellowships.
   */
  async findAll(query: Partial<FellowshipRow>): Promise<Array<Fellowship>> {
    return findQuery(Fellowship)
      .allowEager('[chairman, deputyChairman, secretary, treasurer]')!
      .allowAll(true)
      .build(query);
  }

  /**
   * Creates a new fellowship record in the database.
   * @param info - The fellowship details to be saved.
   * @returns The created fellowship record.
   */
  async create(info: CreateFellowshipInfo): Promise<Fellowship> {
    const row: FellowshipRow = {
      id: this.idHelper.generate(), // Generate a unique fellowship ID
      churchId: info.churchId,
      name: info.name,
      notes: info.notes || null,
      chairmanId: null, // Initialize with no chairman
      deputyChairmanId: null, // Initialize with no deputy chairman
      secretaryId: null, // Initialize with no secretary
      treasurerId: null, // Initialize with no treasurer
      createdAt: this.dateHelper.formatDateTime(), // Set creation timestamp
      updatedAt: this.dateHelper.formatDateTime(), // Set initial update timestamp
    };

    await Fellowship.query().insert(row);
    const fellowship = await this.findById(row.id);
    return fellowship!;
  }

  /**
   * Updates an existing fellowship record.
   * @param id - The fellowship ID to update.
   * @param info - The fields to be updated.
   * @returns The updated fellowship record or undefined if not found.
   */
  async update(
    id: string,
    info: UpdateFellowshipInfo,
  ): Promise<Fellowship | undefined> {
    const updates: Partial<FellowshipRow> = {
      churchId: info.churchId,
      name: info.name,
      notes: info.notes,
      chairmanId: info.chairmanId,
      deputyChairmanId: info.deputyChairmanId,
      secretaryId: info.secretaryId,
      treasurerId: info.treasurerId,
      updatedAt: this.dateHelper.formatDateTime(), // Update timestamp
    };

    // Filter out undefined properties
    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });

    await Fellowship.query().where({ id }).update(updates);
    return this.findById(id);
  }

  /**
   * Deletes a fellowship record by its ID.
   * @param id - The fellowship ID to delete.
   * @returns The deleted fellowship record, or undefined if not found.
   */
  async delete(id: string): Promise<Fellowship | undefined> {
    const fellowship = await this.findById(id);

    if (!fellowship) {
      return undefined; // Fellowship not found
    }

    await Fellowship.query().deleteById(id);
    return fellowship;
  }
}
