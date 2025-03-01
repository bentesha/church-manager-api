import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PasswordHelper {
  /**
   * Generates a password hash and salt.
   * @param password - The plaintext password.
   * @returns An object containing the hashed password and salt.
   */
  hashPassword(password: string): { hash: string; salt: string } {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .createHmac('sha256', salt)
      .update(password)
      .digest('hex');
    return { hash, salt };
  }

  /**
   * Verifies a password against a stored hash and salt.
   * @param password - The plaintext password.
   * @param salt - The stored salt.
   * @param hash - The stored hash.
   * @returns True if the password is valid, otherwise false.
   */
  verifyPassword(password: string, salt: string, hash: string): boolean {
    const computedHash = crypto
      .createHmac('sha256', salt)
      .update(password)
      .digest('hex');
    return computedHash === hash;
  }
}
