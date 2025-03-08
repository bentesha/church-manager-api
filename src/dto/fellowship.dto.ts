export class CreateFellowshipDto {
  name: string;
  notes?: string | null;
  // Leadership roles are not included in creation
  // as members need to be created and assigned to the fellowship first
}

export class UpdateFellowshipDto {
  name?: string;
  notes?: string | null;
  chairmanId?: string | null;
  deputyChairmanId?: string | null;
  secretaryId?: string | null;
  treasurerId?: string | null;
}