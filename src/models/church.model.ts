import { Model } from 'objection';
import { ChurchRow } from 'src/data/church.row';

export class Church extends Model implements ChurchRow {
  id: string;
  name: string;
  domainName: string;
  registrationNumber: string;
  contactPhone: string;
  contactEmail: string;
  createdAt: string | Date;
  updatedAt: string | Date;

  public static tableName = 'churches';
}
