import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PasswordResetToken } from 'src/models/password.reset.token.model';
import { DateHelper } from 'src/helpers/date.helper';
import { IdHelper } from 'src/helpers/id.helper';

export interface CreateTokenInfo {
  userId: string;
  expiresInHours: number;
}

@Injectable()
export class PasswordResetTokenService {
  constructor(
    private readonly idHelper: IdHelper,
    private readonly dateHelper: DateHelper,
  ) {}

  /**
   * Generate a secure random token for password reset
   * @returns A random token string
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create a new password reset token
   * @param info The token creation information
   * @returns The created token
   */
  async createToken(info: CreateTokenInfo): Promise<PasswordResetToken> {
    // Invalidate any existing tokens for this user
    await this.invalidateUserTokens(info.userId);

    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + info.expiresInHours);

    // Create token
    const token = this.generateToken();
    const now = this.dateHelper.formatDateTime();

    const tokenRecord: PasswordResetToken =
      await PasswordResetToken.query().insert({
        id: this.idHelper.generate(),
        userId: info.userId,
        token,
        expiresAt: this.dateHelper.formatDateTime(expiresAt),
        isUsed: false,
        createdAt: now,
        updatedAt: now,
      });

    return tokenRecord;
  }

  /**
   * Validate a password reset token
   * @param token The token to validate
   * @returns The token record if valid, null otherwise
   */
  async validateToken(token: string): Promise<PasswordResetToken | null> {
    const now = new Date();
    const tokenRecord = await PasswordResetToken.query().findOne({
      token,
      isUsed: false,
    });

    if (!tokenRecord) {
      return null;
    }

    // Check if token has expired
    const expiresAt = new Date(tokenRecord.expiresAt);
    if (expiresAt < now) {
      return null;
    }

    return tokenRecord;
  }

  /**
   * Mark a token as used
   * @param token The token to mark as used
   * @returns The updated token record
   */
  async useToken(token: string): Promise<PasswordResetToken | null> {
    const tokenRecord = await this.validateToken(token);
    if (!tokenRecord) {
      return null;
    }

    // Mark token as used
    await PasswordResetToken.query().findById(tokenRecord.id).patch({
      isUsed: true,
      updatedAt: this.dateHelper.formatDateTime(),
    });

    return tokenRecord;
  }

  /**
   * Invalidate all unused tokens for a user
   * @param userId The user ID
   */
  async invalidateUserTokens(userId: string): Promise<void> {
    await PasswordResetToken.query()
      .where({
        userId,
        isUsed: false,
      })
      .patch({
        isUsed: true,
        updatedAt: this.dateHelper.formatDateTime(),
      });
  }

  /**
   * Find a token record by token string
   * @param token The token to find
   * @returns The token record if found, null otherwise
   */
  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const tokenRecord = await PasswordResetToken.query().findOne({ token });
    return tokenRecord || null;
  }
}
