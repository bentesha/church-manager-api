// src/data/envelope.assignment.row.ts
export interface EnvelopeAssignmentRow {
  id: string; // Unique identifier for the assignment record
  envelopeId: string; // Envelope ID being assigned/released
  churchId: string; // Church association
  memberId: string | null; // Member involved in the assignment/release
  activityType: 'ASSIGNMENT' | 'RELEASE'; // Type of activity
  activityAt: Date | string; // Timestamp when the activity occurred
  createdAt: Date | string; // Timestamp for record creation
  updatedAt: Date | string; // Timestamp for last update
}
