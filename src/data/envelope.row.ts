// src/data/envelope.row.ts
export interface EnvelopeRow {
  id: string; // Unique identifier for the envelope record
  churchId: string; // Church association
  envelopeNumber: string; // Unique envelope number
  memberId: string | null; // Currently assigned member, nullable if unassigned
  assignedAt: Date | string | null; // Timestamp when assigned to a member
  releasedAt: Date | string | null; // Timestamp when unassigned from a member
  createdAt: Date | string; // Timestamp for record creation
  updatedAt: Date | string; // Timestamp for last update
}
