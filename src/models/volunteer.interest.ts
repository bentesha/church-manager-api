import { Model } from 'objection';
import { Member } from './member.model';
import { Opportunity } from './opportunity.model';

/**
 * Objection.js model representing the junction table between members and volunteer opportunities
 */
export class VolunteerInterest extends Model {
  memberId!: string;
  opportunityId!: string;
  createdAt!: Date | string;
  updatedAt!: Date | string;

  /**
   * Set the table name for the model
   */
  static tableName = 'member_volunteer_interests';

  /**
   * Set up model relationships
   */
  static get relationMappings() {
    return {
      member: {
        relation: Model.BelongsToOneRelation,
        modelClass: Member,
        join: {
          from: 'member_volunteer_interests.memberId',
          to: 'members.id',
        },
      },
      opportunity: {
        relation: Model.BelongsToOneRelation,
        modelClass: Opportunity,
        join: {
          from: 'member_volunteer_interests.opportunityId',
          to: 'volunteer_opportunities.id',
        },
      },
    };
  }
}
