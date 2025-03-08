import { DependantRelationship } from 'src/types/dependant.relationship';

export interface DependantRow {
  id: string;
  churchId: string;
  memberId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  relationship: DependantRelationship;
  createdAt: Date | string;
  updatedAt: Date | string;
}
