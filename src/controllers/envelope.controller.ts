// envelope.controller.ts
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Check } from 'src/decoractors/check.decorator';
import { MyChurch } from 'src/decorators/my.church.decorator';
import {
  AssignEnvelopeDto,
  CreateEnvelopeDto,
  DeleteEnvelopeDto,
} from 'src/dto/envelope.dto';

import { ValidationException } from 'src/exceptions/validation.exception';
import { CheckGuard } from 'src/guards/check.guard';
import { Church } from 'src/models/church.model';
import { EnvelopeService } from 'src/common/services/envelope.service';
import { MemberService } from 'src/common/services/member.service';
import {
  AssignEnvelopeValidator,
  CreateEnvelopeValidator,
} from 'src/validators/envelope.validator';

@Controller('envelope')
@UseGuards(CheckGuard)
export class EnvelopeController {
  constructor(
    private readonly envelopeService: EnvelopeService,
    private readonly memberService: MemberService,
  ) {}

  @Get()
  @Check('envelope.findAll')
  async findAll(@MyChurch() church: Church, @Query() query) {
    query.churchId = church.id; // Return envelopes that belong to the current church
    return this.envelopeService.findAll(query);
  }

  @Get('/available')
  @Check('envelope.findAvailable')
  async findAvailable(@MyChurch() church: Church) {
    return this.envelopeService.findAvailable(church.id);
  }

  @Get('/:id')
  @Check('envelope.findById')
  async findById(@MyChurch() church: Church, @Param('id') id: string) {
    const envelope = await this.envelopeService.findById(id);
    if (!envelope || envelope.churchId !== church.id) {
      throw new NotFoundException();
    }
    return envelope;
  }

  @Get('/number/:number')
  @Check('envelope.findByNumber')
  async findByNumber(
    @MyChurch() church: Church,
    @Param('number') number: string,
  ) {
    const envelopeNumber = parseInt(number, 10);
    if (isNaN(envelopeNumber)) {
      throw new ValidationException({
        number: 'Envelope number must be a valid integer',
      });
    }

    const envelope = await this.envelopeService.findByNumber(
      envelopeNumber,
      church.id,
    );
    if (!envelope) {
      throw new NotFoundException();
    }
    return envelope;
  }

  @Get('/:id/history')
  @Check('envelope.getHistory')
  async getHistory(@MyChurch() church: Church, @Param('id') id: string) {
    const envelope = await this.envelopeService.findById(id);
    if (!envelope || envelope.churchId !== church.id) {
      throw new NotFoundException();
    }
    return this.envelopeService.getAssignmentHistory(id);
  }

  @Post()
  @Check('envelope.create')
  async create(
    @MyChurch() church: Church,
    @Body(CreateEnvelopeValidator) body: CreateEnvelopeDto,
  ) {
    if (body.startNumber > body.endNumber) {
      throw new ValidationException({
        startNumber: 'Start number must be less than or equal to end number',
      });
    }

    // Check for overlaps
    const hasOverlaps = await this.envelopeService.hasOverlappingNumbers(
      body.startNumber,
      body.endNumber,
      church.id,
    );

    if (hasOverlaps) {
      throw new ValidationException({
        startNumber: 'Envelope number range overlaps with existing envelopes',
      });
    }

    const count = await this.envelopeService.createBlock({
      startNumber: body.startNumber,
      endNumber: body.endNumber,
      churchId: church.id,
    });

    return {
      count,
      startNumber: body.startNumber,
      endNumber: body.endNumber,
    };
  }

  @Delete()
  @Check('envelope.delete')
  async delete(@MyChurch() church: Church, @Body() body: DeleteEnvelopeDto) {
    if (body.startNumber > body.endNumber) {
      throw new ValidationException({
        startNumber: 'Start number must be less than or equal to end number',
      });
    }

    // Check if any envelope in the range has been assigned
    const hasAssignments = await this.envelopeService.hasAnyAssignmentHistory(
      body.startNumber,
      body.endNumber,
      church.id,
    );

    if (hasAssignments) {
      throw new ValidationException({
        startNumber:
          'Cannot delete envelopes that have been assigned to members',
      });
    }

    const count = await this.envelopeService.deleteBlock(
      body.startNumber,
      body.endNumber,
      church.id,
    );

    return {
      count,
      startNumber: body.startNumber,
      endNumber: body.endNumber,
    };
  }

  @Post('/:id/assign')
  @Check('envelope.assign')
  async assign(
    @MyChurch() church: Church,
    @Param('id') id: string,
    @Body(AssignEnvelopeValidator) body: AssignEnvelopeDto,
  ) {
    // Verify envelope exists and belongs to this church
    const envelope = await this.envelopeService.findById(id);
    if (!envelope || envelope.churchId !== church.id) {
      throw new NotFoundException('Envelope not found');
    }

    // Verify envelope is not already assigned
    if (envelope.memberId) {
      throw new ConflictException('Envelope is already assigned to a member');
    }

    // Verify member exists and belongs to this church
    const member = await this.memberService.findById(body.memberId);
    if (!member || member.churchId !== church.id) {
      throw new ValidationException({
        memberId: 'Member with this id could not be found',
      });
    }

    // Check if member already has an envelope
    const existingEnvelope = await this.envelopeService.findOne({
      memberId: body.memberId,
    });

    if (existingEnvelope) {
      throw new ValidationException({
        memberId: 'Member already has an envelope assigned',
      });
    }

    return this.envelopeService.assignToMember(id, body.memberId);
  }

  @Post('/:id/release')
  @Check('envelope.release')
  async release(@MyChurch() church: Church, @Param('id') id: string) {
    // Verify envelope exists and belongs to this church
    const envelope = await this.envelopeService.findById(id);
    if (!envelope || envelope.churchId !== church.id) {
      throw new NotFoundException('Envelope not found');
    }

    // Verify envelope is currently assigned
    if (!envelope.memberId) {
      throw new ConflictException(
        'Envelope is not currently assigned to any member',
      );
    }

    return this.envelopeService.releaseFromMember(id, church.id);
  }
}
