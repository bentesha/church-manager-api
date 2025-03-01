import { Model } from 'objection';
import { SessionRow } from 'src/data/session.row';

export class Session extends Model implements SessionRow {
  id: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  token: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: string | Date;
  expiresAt: Date | string;

  public static tableName = 'sessions';
}
