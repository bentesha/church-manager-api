/**
 * Interface representing a row in the fellowships table
 */
export interface FellowshipRow {
  id: string;
  churchId: string;
  name: string;
  notes: string | null;
  chairmanId: string | null;
  deputyChairmanId: string | null;
  secretaryId: string | null;
  treasurerId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
