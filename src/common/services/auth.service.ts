import { Injectable } from '@nestjs/common';
import { UserCredential } from 'src/models/user.credential.model';
import { SessionService } from 'src/common/services/session.service';
import { PasswordHelper } from 'src/helpers/password.helper';
import { Session } from 'src/models/session.model';

export interface LoginInfo {
  username: string;
  password: string;
  ipAddress: string | null;
  userAgent: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly passwordHelper: PasswordHelper,
  ) {}

  /**
   * Authenticates a user and returns a session if successful, or undefined if invalid credentials.
   * @param username - The username of the user.
   * @param password - The plaintext password.
   * @returns A session if authentication is successful, otherwise undefined.
   */
  async login(info: LoginInfo): Promise<Session | undefined> {
    // Step 1: Retrieve user credentials by username
    const credentials = await UserCredential.query().findOne({
      username: info.username,
    });
    if (!credentials) {
      return undefined;
    }

    // Step 2: Verify password
    const isPasswordValid = this.passwordHelper.verifyPassword(
      info.password,
      credentials.passwordSalt!,
      credentials.passwordHash,
    );
    if (!isPasswordValid) {
      return undefined;
    }

    // Step 3: Create and return a session
    return this.sessionService.create({
      userId: credentials.userId,
      ipAddress: info.ipAddress,
      userAgent: info.userAgent,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
    });
  }
}
