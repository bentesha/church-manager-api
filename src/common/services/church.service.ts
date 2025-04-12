import { Injectable } from '@nestjs/common';
import findQuery from 'objection-find';
import { ChurchRow } from 'src/data/church.row';
import { DateHelper } from 'src/helpers/date.helper';
import { IdHelper } from 'src/helpers/id.helper';
import { Church } from 'src/models/church.model';

export interface CreateChurchInfo {
  name: string;
  domainName: string;
  registrationNumber: string;
  contactPhone: string;
  contactEmail: string;
}

export interface UpdateChurchInfo {
  name?: string;
  domainName?: string;
  registrationNumber?: string;
  contactPhone?: string;
  contactEmail?: string;
}

@Injectable()
export class ChurchService {
  constructor(
    private readonly idHelper: IdHelper,
    private readonly dateHelper: DateHelper,
  ) {}

  /**
   * Finds a church by its ID.
   * @param id - The church's unique identifier.
   * @returns The church record or undefined if not found.
   */
  async findById(id: string): Promise<Church | undefined> {
    return Church.query().findById(id);
  }

  /**
   * Finds a single church matching the provided query.
   * @param query - Partial properties to search for.
   * @returns The first matching church or undefined.
   */
  async findOne(query: Partial<ChurchRow>): Promise<Church | undefined> {
    return findQuery(Church).allowAll(true).build(query).first();
  }

  /**
   * Finds all churches that match the given query.
   * @param query - Partial properties to filter results.
   * @returns A list of matching churches.
   */
  async findAll(query: Partial<ChurchRow>): Promise<Array<Church>> {
    return findQuery(Church).allowAll(true).build(query);
  }

  /**
   * Creates a new church record in the database.
   * @param info - The church details to be saved.
   * @returns The created church record.
   *
   * @note Consider using transactions to ensure consistency in case of failures.
   */
  async create(info: CreateChurchInfo): Promise<Church> {
    const row: ChurchRow = {
      id: this.idHelper.generate(), // Generate a unique church ID
      name: info.name,
      domainName: info.domainName,
      registrationNumber: info.registrationNumber,
      contactPhone: info.contactPhone,
      contactEmail: info.contactEmail,
      createdAt: this.dateHelper.formatDateTime(), // Set creation timestamp
      updatedAt: this.dateHelper.formatDateTime(), // Set initial update timestamp
    };

    // Consider wrapping in a transaction for data consistency
    await Church.query().insert(row);
    const church = await this.findById(row.id);
    return church!;
  }

  /**
   * Updates an existing church record.
   * @param id - The church ID to update.
   * @param info - The fields to be updated.
   * @returns The updated church record or undefined if not found.
   *
   * @note Logging should be added to track updates for auditing purposes.
   */
  async update(
    id: string,
    info: UpdateChurchInfo,
  ): Promise<Church | undefined> {
    const updates: Partial<ChurchRow> = {
      name: info.name,
      domainName: info.domainName,
      registrationNumber: info.registrationNumber,
      contactPhone: info.contactPhone,
      contactEmail: info.contactEmail,
      updatedAt: this.dateHelper.formatDateTime(), // Update timestamp
    };

    await Church.query().where({ id }).update(updates);
    // Consider adding logging here to track update activity.
    return this.findById(id);
  }

  /**
   * Deletes a church record by its ID.
   * @param id - The church ID to delete.
   * @returns The deleted church record, or undefined if not found.
   *
   * @note Instead of hard deletion, consider adding a soft delete flag (e.g., isDeleted column).
   */
  async delete(id: string): Promise<Church | undefined> {
    const church = await this.findById(id);

    if (!church) {
      return undefined; // Church not found
    }

    // Instead of deleting, consider updating an `isDeleted` flag
    // await Church.query().where({ id }).update({ isDeleted: true });

    await Church.query().deleteById(id);
    return church;
  }

  /**
   * Returns the login URL for a church
   * @param church - The church object
   * @returns The login URL for the church
   */
  getLoginLink(church: Church): string {
    return `https://${church.domainName}/login`;
  }

  /**
   * Returns the password reset URL for a church
   * @param church - The church object
   * @param token - The reset token
   * @returns The password reset URL for the church
   */
  getResetLink(church: Church, token: string): string {
    return `https://${church.domainName}/reset-password?token=${token}`;
  }
}
