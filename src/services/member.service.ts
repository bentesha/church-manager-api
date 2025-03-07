import { Injectable } from '@nestjs/common';
import findQuery from 'objection-find';
import { MemberRow } from 'src/data/member.row';
import { DateHelper } from 'src/helpers/date.helper';
import { IdHelper } from 'src/helpers/id.helper';
import { Member } from 'src/models/member.model';
import { Gender } from 'src/types/gender';
import { MarriageType } from 'src/types/marriage.type';
import { MaritalStatus } from 'src/types/marital.status';
import { MemberRole } from 'src/types/member.role';
import { EducationLevel } from 'src/types/education.level';

export interface CreateMemberInfo {
  churchId: string;
  envelopeNumber: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  gender: Gender;
  dateOfBirth: Date | string | null;
  placeOfBirth: string | null;
  profilePhoto: string | null;
  maritalStatus: MaritalStatus;
  marriageType: MarriageType;
  dateOfMarriage: Date | string | null;
  spouseName: string | null;
  placeOfMarriage: string | null;
  phoneNumber: string;
  email: string | null;
  spousePhoneNumber: string | null;
  residenceNumber: string | null;
  residenceBlock: string | null;
  postalBox: string | null;
  residenceArea: string | null;
  formerChurch: string | null;
  occupation: string | null;
  placeOfWork: string | null;
  educationLevel: EducationLevel | null;
  profession: string | null;
  memberRole: MemberRole;
  isBaptized: boolean;
  isConfirmed: boolean;
  partakesLordSupper: boolean;
  fellowshipId: string;
  nearestMemberName: string | null;
  nearestMemberPhone: string | null;
  attendsFellowship: boolean;
  fellowshipAbsenceReason: string | null;
}

export interface UpdateMemberInfo {
  churchId?: string;
  envelopeNumber?: string | null;
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  gender?: Gender;
  dateOfBirth?: Date | string | null;
  placeOfBirth?: string | null;
  profilePhoto?: string | null;
  maritalStatus?: MaritalStatus;
  marriageType?: MarriageType;
  dateOfMarriage?: Date | string | null;
  spouseName?: string | null;
  placeOfMarriage?: string | null;
  phoneNumber?: string;
  email?: string | null;
  spousePhoneNumber?: string | null;
  residenceNumber?: string | null;
  residenceBlock?: string | null;
  postalBox?: string | null;
  residenceArea?: string | null;
  formerChurch?: string | null;
  occupation?: string | null;
  placeOfWork?: string | null;
  educationLevel?: EducationLevel | null;
  profession?: string | null;
  memberRole?: MemberRole;
  isBaptized?: boolean;
  isConfirmed?: boolean;
  partakesLordSupper?: boolean;
  fellowshipId?: string;
  nearestMemberName?: string | null;
  nearestMemberPhone?: string | null;
  attendsFellowship?: boolean;
  fellowshipAbsenceReason?: string | null;
}

@Injectable()
export class MemberService {
  constructor(
    private readonly idHelper: IdHelper,
    private readonly dateHelper: DateHelper,
  ) {}

  /**
   * Finds a member by their ID.
   * @param id - The member's unique identifier.
   * @returns The member record or undefined if not found.
   */
  async findById(id: string): Promise<Member | undefined> {
    return Member.query().findById(id);
  }

  /**
   * Finds a single member matching the provided query.
   * @param query - Partial properties to search for.
   * @returns The first matching member or undefined.
   */
  async findOne(query: Partial<MemberRow>): Promise<Member | undefined> {
    return findQuery(Member).allowAll(true).build(query).first();
  }

  /**
   * Finds all members that match the given query.
   * @param query - Partial properties to filter results.
   * @returns A list of matching members.
   */
  async findAll(query: Partial<MemberRow>): Promise<Array<Member>> {
    return findQuery(Member).allowAll(true).build(query);
  }

  /**
   * Creates a new member record in the database.
   * @param info - The member details to be saved.
   * @returns The created member record.
   *
   * @note Consider using transactions to ensure consistency in case of failures.
   */
  async create(info: CreateMemberInfo): Promise<Member> {
    const row: MemberRow = {
      id: this.idHelper.generate(),
      churchId: info.churchId,
      envelopeNumber: info.envelopeNumber || null,
      firstName: info.firstName,
      middleName: info.middleName || null,
      lastName: info.lastName,
      gender: info.gender,
      dateOfBirth: info.dateOfBirth || null,
      placeOfBirth: info.placeOfBirth || null,
      profilePhoto: info.profilePhoto || null,
      maritalStatus: info.maritalStatus,
      marriageType: info.marriageType,
      dateOfMarriage: info.dateOfMarriage || null,
      spouseName: info.spouseName || null,
      placeOfMarriage: info.placeOfMarriage || null,
      phoneNumber: info.phoneNumber,
      email: info.email || null,
      spousePhoneNumber: info.spousePhoneNumber || null,
      residenceNumber: info.residenceNumber || null,
      residenceBlock: info.residenceBlock || null,
      postalBox: info.postalBox || null,
      residenceArea: info.residenceArea || null,
      formerChurch: info.formerChurch || null,
      occupation: info.occupation || null,
      placeOfWork: info.placeOfWork || null,
      educationLevel: info.educationLevel || null,
      profession: info.profession || null,
      memberRole: info.memberRole || MemberRole.Regular,
      isBaptized: info.isBaptized ?? false,
      isConfirmed: info.isConfirmed ?? false,
      partakesLordSupper: info.partakesLordSupper ?? false,
      fellowshipId: info.fellowshipId,
      nearestMemberName: info.nearestMemberName || null,
      nearestMemberPhone: info.nearestMemberPhone || null,
      attendsFellowship: info.attendsFellowship ?? false,
      fellowshipAbsenceReason: info.fellowshipAbsenceReason || null,
      createdAt: this.dateHelper.formatDateTime(),
      updatedAt: this.dateHelper.formatDateTime(),
    };

    // Consider wrapping in a transaction for data consistency
    await Member.query().insert(row as any);
    const member = await this.findById(row.id);
    return member!;
  }

  /**
   * Updates an existing member record.
   * @param id - The member ID to update.
   * @param info - The fields to be updated.
   * @returns The updated member record or undefined if not found.
   *
   * @note Logging should be added to track updates for auditing purposes.
   */
  async update(
    id: string,
    info: UpdateMemberInfo,
  ): Promise<Member | undefined> {
    const updates: Partial<MemberRow> = {
      churchId: info.churchId,
      envelopeNumber: info.envelopeNumber,
      firstName: info.firstName,
      middleName: info.middleName,
      lastName: info.lastName,
      gender: info.gender,
      dateOfBirth: info.dateOfBirth,
      placeOfBirth: info.placeOfBirth,
      profilePhoto: info.profilePhoto,
      maritalStatus: info.maritalStatus,
      marriageType: info.marriageType,
      dateOfMarriage: info.dateOfMarriage,
      spouseName: info.spouseName,
      placeOfMarriage: info.placeOfMarriage,
      phoneNumber: info.phoneNumber,
      email: info.email,
      spousePhoneNumber: info.spousePhoneNumber,
      residenceNumber: info.residenceNumber,
      residenceBlock: info.residenceBlock,
      postalBox: info.postalBox,
      residenceArea: info.residenceArea,
      formerChurch: info.formerChurch,
      occupation: info.occupation,
      placeOfWork: info.placeOfWork,
      educationLevel: info.educationLevel,
      profession: info.profession,
      memberRole: info.memberRole,
      isBaptized: info.isBaptized,
      isConfirmed: info.isConfirmed,
      partakesLordSupper: info.partakesLordSupper,
      fellowshipId: info.fellowshipId,
      nearestMemberName: info.nearestMemberName,
      nearestMemberPhone: info.nearestMemberPhone,
      attendsFellowship: info.attendsFellowship,
      fellowshipAbsenceReason: info.fellowshipAbsenceReason,
      updatedAt: this.dateHelper.formatDateTime(),
    };

    // Filter out undefined properties to only update what was provided
    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });

    await Member.query().where({ id }).update(updates);
    return this.findById(id);
  }

  /**
   * Deletes a member record by its ID.
   * @param id - The member ID to delete.
   * @returns The deleted member record, or undefined if not found.
   *
   * @note Instead of hard deletion, consider adding a soft delete flag (e.g., isDeleted column).
   */
  async delete(id: string): Promise<Member | undefined> {
    const member = await this.findById(id);

    if (!member) {
      return undefined; // Member not found
    }

    // Instead of deleting, consider updating an `isDeleted` flag
    // await Member.query().where({ id }).update({ isDeleted: true });

    await Member.query().deleteById(id);
    return member;
  }

  /**
   * Finds members that belong to a specific fellowship.
   * @param fellowshipId - The fellowship ID to filter by.
   * @returns A list of members in the specified fellowship.
   */
  async findByFellowship(fellowshipId: string): Promise<Array<Member>> {
    return Member.query().where({ fellowshipId });
  }
}
