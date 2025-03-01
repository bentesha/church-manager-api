import { DependantRelationship } from 'src/types/dependant.relationship';

export interface Dependant {
  id: string;
  church_id: string;
  member_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  relationship: DependantRelationship;
  created_at: Date | string;
  updated_at: Date | string;
}
