export interface FellowshipRow {
  id: string;
  churchId: string;
  name: string;
  notes: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
