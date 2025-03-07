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
import { FellowshipService } from 'src/services/fellowship.service';
import {
  CreateMemberInfo,
  MemberService,
  UpdateMemberInfo,
} from 'src/services/member.service';
import { CreateMemberValidator } from 'src/validators/member.validator';

@Controller('member')
@UseGuards(CheckGuard)
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly fellowshipService: FellowshipService,
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
    return member;
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
    };

    return this.memberService.create(info);
  }

  @Patch('/:id')
  @Check('member.update')
  async update(
    @MyChurch() church: Church,
    @Param('id') id: string,
    @Body() body: UpdateMemberDto,
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
      const fellowship = await this.memberService.findOne({
        id: body.fellowshipId,
        churchId: church.id,
      });

      if (!fellowship) {
        throw new ValidationException({
          fellowshipId: 'Invalid fellowship ID',
        });
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
    };

    const updatedMember = await this.memberService.update(id, info);
    return updatedMember;
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
