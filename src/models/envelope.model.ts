// src/models/envelope.model.ts
import { Model } from 'objection';
import { EnvelopeRow } from 'src/data/envelope.row';

export class Envelope extends Model implements EnvelopeRow {
  id!: string;
  churchId!: string;
  envelopeNumber!: string;
  memberId!: string | null;
  assignedAt!: Date | string | null;
  releasedAt!: Date | string | null;
  createdAt!: Date | string;
  updatedAt!: Date | string;

  // Table name in the database
  static tableName = 'envelopes';

  // Define relationships
  static get relationMappings() {
    // Import models to avoid circular dependencies
    const { Member } = require('./member.model');
    const { Church } = require('./church.model');
    const { EnvelopeAssignment } = require('./envelope.assignment.model');

    return {
      // Relationship with the currently assigned member
      member: {
        relation: Model.BelongsToOneRelation,
        modelClass: Member,
        join: {
          from: 'envelopes.memberId',
          to: 'members.id',
        },
      },
      // Relationship with assignment history
      history: {
        relation: Model.HasManyRelation,
        modelClass: EnvelopeAssignment,
        join: {
          from: 'envelopes.id',
          to: 'envelope_assignments.envelopeId',
        },
      },
    };
  }
}
