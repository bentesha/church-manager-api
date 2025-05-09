import { EducationLevel } from 'src/types/education.level';
import { Gender } from 'src/types/gender';
import { MaritalStatus } from 'src/types/marital.status';
import { MarriageType } from 'src/types/marriage.type';
import { MemberRole } from 'src/types/member.role';
import { DependantRelationship } from 'src/types/dependant.relationship';

// Interface for dependant data in DTOs
export interface DependantDto {
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  relationship: DependantRelationship;
}

// Interface for updating dependant data
export interface UpdateDependantDto {
  id?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string | null;
  relationship?: DependantRelationship;
}

export interface CreateMemberDto {
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
  interests?: string[];
  dependants?: DependantDto[];
}

export interface UpdateMemberInfo {
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
  interests?: string[];
  dependants?: UpdateDependantDto[];
  addDependants?: DependantDto[];
  removeDependantIds?: string[];
}
