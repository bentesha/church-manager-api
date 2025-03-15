// src/models/envelope.assignment.model.ts
import { Model } from 'objection';
import { EnvelopeAssignmentRow } from 'src/data/envelope.assignment.row';

export class EnvelopeAssignment extends Model implements EnvelopeAssignmentRow {
  id!: string;
  envelopeId!: string;
  churchId!: string;
  memberId!: string | null;
  activityType!: 'ASSIGNMENT' | 'RELEASE';
  activityAt!: Date | string;
  createdAt!: Date | string;
  updatedAt!: Date | string;

  // Table name in the database
  static tableName = 'envelope_assignments';

  // Define relationships
  static get relationMappings() {
    // Import models to avoid circular dependencies
    const { Envelope } = require('./envelope.model');
    const { Member } = require('./member.model');
    const { Church } = require('./church.model');

    return {
      // Relationship with the envelope
      envelope: {
        relation: Model.BelongsToOneRelation,
        modelClass: Envelope,
        join: {
          from: 'envelope_assignments.envelopeId',
          to: 'envelopes.id',
        },
      },
      // Relationship with the member
      member: {
        relation: Model.BelongsToOneRelation,
        modelClass: Member,
        join: {
          from: 'envelope_assignments.memberId',
          to: 'members.id',
        },
      },
    };
  }

  // Query modifiers for common filtered queries
  static get modifiers() {
    return {
      // Get only assignment activities
      assignments(query) {
        query.where('activityType', 'ASSIGNMENT');
      },
      // Get only release activities
      releases(query) {
        query.where('activityType', 'RELEASE');
      },
      // Sort by most recent activity first (newest to oldest)
      chronological(query) {
        query.orderBy('activityAt', 'asc');
      },
      // Sort by most recent activity first (newest to oldest)
      reverseChronological(query) {
        query.orderBy('activityAt', 'desc');
      },
    };
  }
}
