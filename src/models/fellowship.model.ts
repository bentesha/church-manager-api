import { Model } from 'objection';
import { FellowshipRow } from 'src/data/fellowship.row';

export class Fellowship extends Model implements FellowshipRow {
  id: string;
  churchId: string;
  name: string;
  notes: string | null;
  chairmanId: string | null;
  deputyChairmanId: string | null;
  secretaryId: string | null;
  treasurerId: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;

  // Relationships
  chairman?: any;
  deputyChairman?: any;
  secretary?: any;
  treasurer?: any;

  public static tableName = 'fellowships';

  /**
   * Set up model relationships
   */
  static get relationMappings() {
    // Import Member model to avoid circular dependencies
    const { Member } = require('./member.model');

    return {
      chairman: {
        relation: Model.BelongsToOneRelation,
        modelClass: Member,
        join: {
          from: 'fellowships.chairmanId',
          to: 'members.id',
        },
      },
      deputyChairman: {
        relation: Model.BelongsToOneRelation,
        modelClass: Member,
        join: {
          from: 'fellowships.deputyChairmanId',
          to: 'members.id',
        },
      },
      secretary: {
        relation: Model.BelongsToOneRelation,
        modelClass: Member,
        join: {
          from: 'fellowships.secretaryId',
          to: 'members.id',
        },
      },
      treasurer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Member,
        join: {
          from: 'fellowships.treasurerId',
          to: 'members.id',
        },
      },
      members: {
        relation: Model.HasManyRelation,
        modelClass: Member,
        join: {
          from: 'fellowships.id',
          to: 'members.fellowshipId',
        },
      },
    };
  }
}
