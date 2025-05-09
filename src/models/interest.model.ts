import { Model } from 'objection';
import { InterestRow } from 'src/data/interest.row';
import { Member } from './member.model';
import { Opportunity } from './opportunity.model';

export class Interest extends Model implements InterestRow {
  memberId: string;
  opportunityId: string;
  createdAt: string | Date;
  updatedAt: string | Date;

  static tableName = 'member_volunteer_interests';

  static relationMappings = {
    member: {
      modelClass: Member,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'member_volunteer_interests.memberId',
        to: 'members.id',
      },
    },
    opportunity: {
      modelClass: Opportunity,
      relation: Model.BelongsToOneRelation,
      join: {
        from: 'member_volunteer_interests.opportunityId',
        to: 'volunteer_opportunities.id',
      },
    },
  };
}
