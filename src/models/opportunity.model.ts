import { Model } from 'objection';
import { OpportunityRow } from 'src/data/opportunity.row';

export class Opportunity extends Model implements OpportunityRow {
  id!: string;
  churchId!: string;
  name!: string;
  description!: string;
  createdAt!: Date | string;
  updatedAt!: Date | string;

  // Table name in the database
  static tableName = 'volunteer_opportunities';

  // Define relationships
  static get relationMappings() {
    return {};
  }
}
