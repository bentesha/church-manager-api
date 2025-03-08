import { Dependencies, Injectable } from '@nestjs/common';
import findQuery from 'objection-find';
import { MemberRow } from 'src/data/member.row';
import { DateHelper } from 'src/helpers/date.helper';
import { IdHelper } from 'src/helpers/id.helper';
import { Member } from 'src/models/member.model';
import { Dependant } from 'src/models/dependant.model';
import { Gender } from 'src/types/gender';
import { MarriageType } from 'src/types/marriage.type';
import { MaritalStatus } from 'src/types/marital.status';
import { MemberRole } from 'src/types/member.role';
import { EducationLevel } from 'src/types/education.level';
import { VolunteerInterest } from 'src/models/volunteer.interest';
import { DependantDto, UpdateDependantDto } from 'src/dto/member.dto';

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
  interests?: Array<string>;
  dependants?: DependantDto[];
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
  interests?: Array<string>;
  dependants?: UpdateDependantDto[];
  addDependants?: DependantDto[];
  removeDependantIds?: string[];
}

@Injectable()
export class MemberService {
  constructor(
    private readonly idHelper: IdHelper,
    private readonly dateHelper: DateHelper,
  ) {}

  /**
   * Finds a member by their ID with related records.
   * @param id - The member's unique identifier.
   * @returns The member record or undefined if not found.
   */
  async findById(id: string): Promise<Member | undefined> {
    const query = Member.query()
      .withGraphFetched('[interests, dependants]')
      .findById(id);

    return query;
  }

  /**
   * Finds a single member matching the provided query.
   * @param query - Partial properties to search for.
   * @returns The first matching member or undefined.
   */
  async findOne(query: Partial<MemberRow>): Promise<Member | undefined> {
    return findQuery(Member)
      .allowEager('[interests, dependants, fellowship]')!
      .allowAll(true)
      .build(query)
      .first();
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
   */
  async create(info: CreateMemberInfo): Promise<Member> {
    // Extract interests and dependants from the info object
    const { interests, dependants } = info;

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

    // Use a transaction to ensure member and related records are created consistently
    const member = await Member.transaction(async (trx) => {
      // Insert the member
      const createdMember = await Member.query(trx).insert(row as any);

      // Handle interests sequentially
      if (interests && interests.length > 0) {
        const timestamp = this.dateHelper.formatDateTime();
        for (const opportunityId of interests) {
          await VolunteerInterest.query().transacting(trx).insert({
            memberId: createdMember.id,
            opportunityId,
            createdAt: timestamp,
            updatedAt: timestamp,
          });
        }
      }

      // Handle dependants sequentially
      if (dependants && dependants.length > 0) {
        const timestamp = this.dateHelper.formatDateTime();
        for (const dep of dependants) {
          await Dependant.query()
            .transacting(trx)
            .insert({
              id: this.idHelper.generate(),
              churchId: row.churchId,
              memberId: createdMember.id,
              firstName: dep.firstName,
              lastName: dep.lastName,
              dateOfBirth: dep.dateOfBirth || null,
              relationship: dep.relationship,
              createdAt: timestamp,
              updatedAt: timestamp,
            });
        }
      }

      return createdMember!;
    })!;

    // Return member with related records loaded
    return (await this.findById(member.id))!;
  }

  /**
   * Updates an existing member record.
   * @param id - The member ID to update.
   * @param info - The fields to be updated.
   * @returns The updated member record or undefined if not found.
   */
  async update(
    id: string,
    info: UpdateMemberInfo,
  ): Promise<Member | undefined> {
    // Extract interests and dependant-related info
    const { interests, dependants, addDependants, removeDependantIds } = info;

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

    // Filter out undefined properties
    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });

    await Member.transaction(async (trx) => {
      // Update member's basic information
      await Member.query(trx).where({ id }).update(updates);

      // Handle interests sequentially
      if (interests !== undefined) {
        // First, delete existing interests
        await VolunteerInterest.query()
          .transacting(trx)
          .where({ memberId: id })
          .delete();

        // Then insert new interests sequentially
        if (interests && interests.length > 0) {
          const timestamp = this.dateHelper.formatDateTime();
          for (const opportunityId of interests) {
            await VolunteerInterest.query().transacting(trx).insert({
              memberId: id,
              opportunityId,
              createdAt: timestamp,
              updatedAt: timestamp,
            });
          }
        }
      }

      // Handle dependants
      // Remove specified dependants
      if (removeDependantIds && removeDependantIds.length > 0) {
        await Dependant.query(trx).whereIn('id', removeDependantIds).delete();
      }

      // Add new dependants sequentially
      if (addDependants && addDependants.length > 0) {
        const timestamp = this.dateHelper.formatDateTime();
        for (const dep of addDependants) {
          await Dependant.query(trx).insert({
            id: this.idHelper.generate(),
            churchId: updates.churchId,
            memberId: id,
            firstName: dep.firstName,
            lastName: dep.lastName,
            dateOfBirth: dep.dateOfBirth ?? null,
            relationship: dep.relationship,
            createdAt: timestamp,
            updatedAt: timestamp,
          });
        }
      }

      // Update existing dependants sequentially
      if (dependants && dependants.length > 0) {
        const timestamp = this.dateHelper.formatDateTime();
        for (const dep of dependants) {
          if (!dep.id) continue; // Skip if no ID provided

          await Dependant.query(trx)
            .where({ id: dep.id, memberId: id })
            .update({
              firstName: dep.firstName,
              lastName: dep.lastName,
              dateOfBirth: dep.dateOfBirth,
              relationship: dep.relationship,
              updatedAt: timestamp,
            });
        }
      }
    });

    // Return the updated member with all relations
    const member = await this.findById(id);
    return member!;
  }

  /**
   * Deletes a member record by its ID.
   * @param id - The member ID to delete.
   * @returns The deleted member record, or undefined if not found.
   */
  async delete(id: string): Promise<Member | undefined> {
    const member = await this.findById(id);

    if (!member) {
      return undefined; // Member not found
    }

    return Member.transaction(async (trx) => {
      // Delete all interest relations
      await VolunteerInterest.query(trx).where({ memberId: id }).delete();

      // Delete all dependants
      await Dependant.query(trx).where({ memberId: id }).delete();

      // Delete the member
      await Member.query(trx).deleteById(id);

      return member;
    });
  }

  async findDependantById(
    dependantId: string,
    memberId: string,
  ): Promise<Dependant | undefined> {
    return Dependant.query().findOne({ id: dependantId, memberId });
  }
}
