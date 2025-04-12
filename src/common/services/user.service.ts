import { Injectable } from '@nestjs/common';
import findQuery from 'objection-find';
import { UserRow } from 'src/data/user.row';
import { UserCredentialRow } from 'src/data/user.credential.row';
import { DateHelper } from 'src/helpers/date.helper';
import { IdHelper } from 'src/helpers/id.helper';
import { User } from 'src/models/user.model';
import { UserCredential } from 'src/models/user.credential.model';
import { SessionService } from './session.service';

export interface CreateUserInfo {
  name: string;
  email: string;
  phoneNumber: string | null;
  churchId: string;
  roleId: string;
  passwordHash: string;
  passwordSalt: string;
}

export interface UpdateUserInfo {
  name?: string;
  phoneNumber?: string;
  isActive?: boolean;
  roleId?: string;
  passwordHash?: string;
  passwordSalt?: string;
}

@Injectable()
export class UserService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly idHelper: IdHelper,
    private readonly dateHelper: DateHelper,
  ) {}

  /**
   * Finds a user by their ID.
   * @param id - The user ID.
   * @returns The user record or undefined if not found.
   */
  async findById(id: string): Promise<User | undefined> {
    return User.query().findById(id);
  }

  /**
   * Finds a single user matching the provided query.
   * @param query - Partial user properties to search for.
   * @returns The first matching user or undefined.
   */
  async findOne(query: Partial<UserRow>): Promise<User | undefined> {
    return findQuery(User).allowAll(true).build(query).first();
  }

  /**
   * Finds all users matching the given query.
   * @param query - Partial user properties to filter results.
   * @returns A list of matching users.
   */
  async findAll(query: Partial<UserRow>): Promise<Array<User>> {
    return findQuery(User).allowAll(true).build(query);
  }

  /**
   * Creates a new user along with their credentials.
   * @param info - The user and credential details.
   * @returns The created user record.
   *
   * @note This should be executed inside a transaction to ensure consistency.
   */
  async create(info: CreateUserInfo): Promise<User> {
    const user = await User.transaction(async (trx) => {
      const userId = this.idHelper.generate();
      const timestamp = this.dateHelper.formatDateTime();

      // Create user record
      const userRow: UserRow = {
        id: userId,
        name: info.name,
        email: info.email,
        phoneNumber: info.phoneNumber,
        churchId: info.churchId,
        roleId: info.roleId,
        isActive: true,
        isDeleted: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const user = await User.query(trx).insert(userRow);
      // Create user credentials record
      const credentialRow: UserCredentialRow = {
        userId,
        username: info.email,
        passwordHash: info.passwordHash,
        passwordSalt: info.passwordSalt ?? null,
        lastLoginAt: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      await UserCredential.query(trx).insert(credentialRow);
      return user;
    });

    // Return the updated user
    return (await this.findById(user.id))!;
  }

  /**
   * Updates an existing user record.
   * @param id - The user ID.
   * @param info - The fields to update.
   * @returns The updated user record or undefined if not found.
   */
  async update(id: string, info: UpdateUserInfo): Promise<User | undefined> {
    return User.transaction(async (trx) => {
      const updates: Partial<UserRow> = {
        name: info.name,
        phoneNumber: info.phoneNumber,
        roleId: info.roleId,
        isActive: info.isActive,
        updatedAt: this.dateHelper.formatDateTime(),
      };

      await User.query(trx).where({ id }).update(updates);

      if (info.passwordHash && info.passwordSalt) {
        await UserCredential.query(trx).where({ userId: id }).update({
          passwordHash: info.passwordHash,
          passwordSalt: info.passwordSalt,
        });

        // Deactivate all user sessions
        await this.sessionService.deactivateAll(id);
      }

      return this.findById(id);
    });
  }

  /**
   * Soft deletes a user by setting isDeleted to true.
   * @param id - The user ID.
   * @returns The deleted user record or undefined if not found.
   *
   * @note Instead of deleting, we mark the user as deleted and keep the credentials.
   */
  async softDelete(id: string): Promise<User | undefined> {
    const user = await this.findById(id);
    if (!user) return undefined;

    await User.query().where({ id }).update({
      isDeleted: true,
      updatedAt: this.dateHelper.formatDateTime(),
    });

    return user;
  }

  /**
   * Permanently deletes a user and their credentials.
   * @param id - The user ID.
   * @returns The deleted user record or undefined if not found.
   *
   * @note This should be done in a transaction to ensure consistency.
   */
  async delete(id: string): Promise<User | undefined> {
    return User.transaction(async (trx) => {
      const user = await this.findById(id);
      if (!user) return undefined;

      // Delete credentials first
      await UserCredential.query(trx).where({ userId: id }).delete();
      // Delete user
      await User.query(trx).where({ id }).delete();

      return user;
    });
  }

  async findCredentials(username: string): Promise<UserCredential | undefined> {
    const credentials = await UserCredential.query().findOne({ username });
    return credentials;
  }
}
