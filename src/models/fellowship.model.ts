import { Model } from 'objection';
import { FellowshipRow } from 'src/data/fellowship.row';

export class Fellowship extends Model implements FellowshipRow {
  id: string;
  churchId: string;
  name: string;
  notes: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;

  public static tableName = 'fellowships';
}
