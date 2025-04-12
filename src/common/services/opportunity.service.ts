import { Injectable } from '@nestjs/common';
import findQuery from 'objection-find';
import { OpportunityRow } from 'src/data/opportunity.row';
import { DateHelper } from 'src/helpers/date.helper';
import { IdHelper } from 'src/helpers/id.helper';
import { Opportunity } from 'src/models/opportunity.model';

export interface CreateOpportunityInfo {
  churchId: string;
  name: string;
  description: string;
}

export interface UpdateOpportunityInfo {
  name?: string;
  description?: string;
}

@Injectable()
export class OpportunityService {
  constructor(
    private readonly idHelper: IdHelper,
    private readonly dateHelper: DateHelper,
  ) {}

  /**
   * Finds an opportunity by its ID.
   * @param id - The opportunity's unique identifier.
   * @returns The opportunity record or undefined if not found.
   */
  async findById(id: string): Promise<Opportunity | undefined> {
    return Opportunity.query().findById(id);
  }

  /**
   * Finds a single opportunity matching the provided query.
   * @param query - Partial properties to search for.
   * @returns The first matching opportunity or undefined.
   */
  async findOne(
    query: Partial<OpportunityRow>,
  ): Promise<Opportunity | undefined> {
    return findQuery(Opportunity).allowAll(true).build(query).first();
  }

  /**
   * Finds all opportunities that match the given query.
   * @param query - Partial properties to filter results.
   * @returns A list of matching opportunities.
   */
  async findAll(query: Partial<OpportunityRow>): Promise<Array<Opportunity>> {
    return findQuery(Opportunity).allowAll(true).build(query);
  }

  /**
   * Creates a new volunteer opportunity record in the database.
   * @param info - The opportunity details to be saved.
   * @returns The created opportunity record.
   *
   * @note Consider using transactions to ensure consistency in case of failures.
   */
  async create(info: CreateOpportunityInfo): Promise<Opportunity> {
    const row: OpportunityRow = {
      id: this.idHelper.generate(), // Generate a unique opportunity ID
      churchId: info.churchId,
      name: info.name,
      description: info.description,
      createdAt: this.dateHelper.formatDateTime(), // Set creation timestamp
      updatedAt: this.dateHelper.formatDateTime(), // Set initial update timestamp
    };

    // Consider wrapping in a transaction for data consistency
    await Opportunity.query().insert(row);
    const opportunity = await this.findById(row.id);
    return opportunity!;
  }

  /**
   * Updates an existing opportunity record.
   * @param id - The opportunity ID to update.
   * @param info - The fields to be updated.
   * @returns The updated opportunity record or undefined if not found.
   *
   * @note Logging should be added to track updates for auditing purposes.
   */
  async update(
    id: string,
    info: UpdateOpportunityInfo,
  ): Promise<Opportunity | undefined> {
    const updates: Partial<OpportunityRow> = {
      name: info.name,
      description: info.description,
      updatedAt: this.dateHelper.formatDateTime(), // Update timestamp
    };

    await Opportunity.query().where({ id }).update(updates);
    // Consider adding logging here to track update activity.
    return this.findById(id);
  }

  /**
   * Deletes an opportunity record by its ID.
   * @param id - The opportunity ID to delete.
   * @returns The deleted opportunity record, or undefined if not found.
   *
   * @note Instead of hard deletion, consider adding a soft delete flag (e.g., isDeleted column).
   */
  async delete(id: string): Promise<Opportunity | undefined> {
    const opportunity = await this.findById(id);

    if (!opportunity) {
      return undefined; // Opportunity not found
    }

    // Instead of deleting, consider updating an `isDeleted` flag
    // await Opportunity.query().where({ id }).update({ isDeleted: true });

    await Opportunity.query().deleteById(id);
    return opportunity;
  }
}
