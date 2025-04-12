import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Check } from 'src/decoractors/check.decorator';
import { MyChurch } from 'src/decorators/my.church.decorator';
import {
  CreateMemberDto,
  UpdateMemberInfo as UpdateMemberDto,
} from 'src/dto/member.dto';
import { ValidationException } from 'src/exceptions/validation.exception';
import { CheckGuard } from 'src/guards/check.guard';
import { Church } from 'src/models/church.model';
import { FellowshipService } from 'src/common/services/fellowship.service';
import { OpportunityService } from 'src/common/services/opportunity.service';
import {
  CreateMemberInfo,
  MemberService,
  UpdateMemberInfo,
} from 'src/common/services/member.service';
import {
  CreateMemberValidator,
  UpdateMemberValidator,
} from 'src/validators/member.validator';

@Controller('member')
@UseGuards(CheckGuard)
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly fellowshipService: FellowshipService,
    private readonly opportunityService: OpportunityService,
  ) {}

  @Get()
  @Check('member.findAll')
  async findAll(@MyChurch() church: Church, @Query() query) {
    query.churchId = church.id; // Return members that belong to the current church

    return this.memberService.findAll(query);
  }

  @Get('/:id')
  @Check('member.findById')
  async findById(@MyChurch() church: Church, @Param('id') id: string) {
    const member = await this.memberService.findById(id);
    if (!member || member.churchId !== church.id) {
      throw new NotFoundException();
    }

    // Load the member's volunteer interests
    const memberWithInterests = await this.memberService.findById(id);
    return memberWithInterests;
  }

  @Post()
  @Check('member.create')
  async create(
    @MyChurch() church: Church,
    @Body(CreateMemberValidator) body: CreateMemberDto,
  ) {
    // Check if envelope number is unique if provided
    if (body.envelopeNumber) {
      const existingMember = await this.memberService.findOne({
        envelopeNumber: body.envelopeNumber,
        churchId: church.id,
      });

      if (existingMember) {
        throw new ValidationException({
          envelopeNumber: 'Envelope number must be unique within this church',
        });
      }
    }

    // Check if phone number is unique within this church
    const memberWithSamePhone = await this.memberService.findOne({
      phoneNumber: body.phoneNumber,
      churchId: church.id,
    });

    if (memberWithSamePhone) {
      throw new ValidationException({
        phoneNumber: 'Phone number must be unique within this church',
      });
    }

    // Verify the fellowship belongs to this church
    const fellowship = await this.fellowshipService.findOne({
      id: body.fellowshipId,
      churchId: church.id,
    });

    if (!fellowship) {
      throw new ValidationException({
        fellowshipId: 'Invalid fellowship ID',
      });
    }

    // Validate interests if provided
    if (body.interests && body.interests.length > 0) {
      // Verify all provided opportunities exist and belong to this church
      for (const opportunityId of body.interests) {
        const opportunity = await this.opportunityService.findOne({
          id: opportunityId,
          churchId: church.id,
        });

        if (!opportunity) {
          throw new ValidationException({
            interests: `Invalid opportunity ID: ${opportunityId}`,
          });
        }
      }
    }

    const info: CreateMemberInfo = {
      churchId: church.id,
      envelopeNumber: body.envelopeNumber,
      firstName: body.firstName,
      middleName: body.middleName,
      lastName: body.lastName,
      gender: body.gender,
      dateOfBirth: body.dateOfBirth,
      placeOfBirth: body.placeOfBirth,
      profilePhoto: body.profilePhoto,
      maritalStatus: body.maritalStatus,
      marriageType: body.marriageType,
      dateOfMarriage: body.dateOfMarriage,
      spouseName: body.spouseName,
      placeOfMarriage: body.placeOfMarriage,
      phoneNumber: body.phoneNumber,
      email: body.email,
      spousePhoneNumber: body.spousePhoneNumber,
      residenceNumber: body.residenceNumber,
      residenceBlock: body.residenceBlock,
      postalBox: body.postalBox,
      residenceArea: body.residenceArea,
      formerChurch: body.formerChurch,
      occupation: body.occupation,
      placeOfWork: body.placeOfWork,
      educationLevel: body.educationLevel,
      profession: body.profession,
      memberRole: body.memberRole,
      isBaptized: body.isBaptized,
      isConfirmed: body.isConfirmed,
      partakesLordSupper: body.partakesLordSupper,
      fellowshipId: body.fellowshipId,
      nearestMemberName: body.nearestMemberName,
      nearestMemberPhone: body.nearestMemberPhone,
      attendsFellowship: body.attendsFellowship,
      fellowshipAbsenceReason: body.fellowshipAbsenceReason,
      interests: body.interests ?? [],
      dependants: body.dependants ?? [],
    };

    const member = await this.memberService.create(info);

    // Load and return the member with their interests
    return this.memberService.findById(member.id);
  }

  @Patch('/:id')
  @Check('member.update')
  async update(
    @MyChurch() church: Church,
    @Param('id') id: string,
    @Body(UpdateMemberValidator) body: UpdateMemberDto,
  ) {
    // Verify the member exists and belongs to this church
    const member = await this.memberService.findById(id);
    if (!member || member.churchId !== church.id) {
      throw new NotFoundException();
    }

    // Check if envelope number is unique if being updated
    if (body.envelopeNumber && body.envelopeNumber !== member.envelopeNumber) {
      const existingMember = await this.memberService.findOne({
        envelopeNumber: body.envelopeNumber,
        churchId: church.id,
      });

      if (existingMember && existingMember.id !== id) {
        throw new ValidationException({
          envelopeNumber: 'Envelope number must be unique within this church',
        });
      }
    }

    // Check if phone number is unique if being updated
    if (body.phoneNumber && body.phoneNumber !== member.phoneNumber) {
      const memberWithSamePhone = await this.memberService.findOne({
        phoneNumber: body.phoneNumber,
        churchId: church.id,
      });

      if (memberWithSamePhone && memberWithSamePhone.id !== id) {
        throw new ValidationException({
          phoneNumber: 'Phone number must be unique within this church',
        });
      }
    }

    // Verify the fellowship belongs to this church if being updated
    if (body.fellowshipId && body.fellowshipId !== member.fellowshipId) {
      const fellowship = await this.fellowshipService.findOne({
        id: body.fellowshipId,
        churchId: church.id,
      });

      if (!fellowship) {
        throw new ValidationException({
          fellowshipId: 'Invalid fellowship ID',
        });
      }
    }

    // Validate interests if provided
    if (body.interests && body.interests.length > 0) {
      // Verify all provided opportunities exist and belong to this church
      for (const opportunityId of body.interests) {
        const opportunity = await this.opportunityService.findOne({
          id: opportunityId,
          churchId: church.id,
        });

        if (!opportunity) {
          throw new ValidationException({
            interests: `Invalid opportunity ID: ${opportunityId}`,
          });
        }
      }
    }

    // Validate existing dependants being updated
    if (body.dependants && body.dependants.length > 0) {
      for (const dependant of body.dependants) {
        const existingDependant = await this.memberService.findDependantById(
          dependant.id!,
          member.id,
        );

        if (!existingDependant) {
          throw new ValidationException({
            dependants: `Invalid dependant ID: ${dependant.id}`,
          });
        }
      }
    }

    // Validate dependant IDs to be removed
    if (body.removeDependantIds && body.removeDependantIds.length > 0) {
      for (const dependantId of body.removeDependantIds) {
        const existingDependant = await this.memberService.findDependantById(
          dependantId,
          member.id,
        );

        if (!existingDependant) {
          throw new ValidationException({
            removeDependantIds: `Invalid dependant ID: ${dependantId}`,
          });
        }
      }
    }

    const info: UpdateMemberInfo = {
      envelopeNumber: body.envelopeNumber,
      firstName: body.firstName,
      middleName: body.middleName,
      lastName: body.lastName,
      gender: body.gender,
      dateOfBirth: body.dateOfBirth,
      placeOfBirth: body.placeOfBirth,
      profilePhoto: body.profilePhoto,
      maritalStatus: body.maritalStatus,
      marriageType: body.marriageType,
      dateOfMarriage: body.dateOfMarriage,
      spouseName: body.spouseName,
      placeOfMarriage: body.placeOfMarriage,
      phoneNumber: body.phoneNumber,
      email: body.email,
      spousePhoneNumber: body.spousePhoneNumber,
      residenceNumber: body.residenceNumber,
      residenceBlock: body.residenceBlock,
      postalBox: body.postalBox,
      residenceArea: body.residenceArea,
      formerChurch: body.formerChurch,
      occupation: body.occupation,
      placeOfWork: body.placeOfWork,
      educationLevel: body.educationLevel,
      profession: body.profession,
      memberRole: body.memberRole,
      isBaptized: body.isBaptized,
      isConfirmed: body.isConfirmed,
      partakesLordSupper: body.partakesLordSupper,
      fellowshipId: body.fellowshipId,
      nearestMemberName: body.nearestMemberName,
      nearestMemberPhone: body.nearestMemberPhone,
      attendsFellowship: body.attendsFellowship,
      fellowshipAbsenceReason: body.fellowshipAbsenceReason,
      interests: body.interests,
      dependants: body.dependants,
      addDependants: body.addDependants,
      removeDependantIds: body.removeDependantIds,
    };

    await this.memberService.update(id, info);

    // Load and return the updated member with their interests
    return this.memberService.findById(id);
  }

  @Delete('/:id')
  @Check('member.deleteById')
  async deleteById(@MyChurch() church: Church, @Param('id') id: string) {
    // Verify the member exists and belongs to this church
    const member = await this.memberService.findById(id);
    if (!member || member.churchId !== church.id) {
      throw new NotFoundException();
    }

    return this.memberService.delete(id);
  }
}
