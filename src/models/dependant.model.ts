import { Model } from 'objection';
import { DependantRelationship } from 'src/types/dependant.relationship';
import { Member } from './member.model';
import { DependantRow } from 'src/data/dependant.row';

/**
 * Objection.js model representing a member's dependant
 */
export class Dependant extends Model implements DependantRow {
  id!: string;
  churchId!: string;
  memberId!: string;
  firstName!: string;
  lastName!: string;
  dateOfBirth!: string | null;
  relationship!: DependantRelationship;
  createdAt!: Date | string;
  updatedAt!: Date | string;

  /**
   * Set the table name for the model
   */
  static tableName = 'dependants';

  /**
   * Set up model relationships
   */
  static get relationMappings() {
    return {
      member: {
        relation: Model.BelongsToOneRelation,
        modelClass: Member,
        join: {
          from: 'dependants.memberId',
          to: 'members.id',
        },
      },
    };
  }
}
