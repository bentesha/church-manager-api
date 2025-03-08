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
  BadRequestException,
} from '@nestjs/common';
import { Check } from 'src/decoractors/check.decorator';
import { MyChurch } from 'src/decorators/my.church.decorator';
import {
  CreateFellowshipDto,
  UpdateFellowshipDto,
} from 'src/dto/fellowship.dto';
import { ValidationException } from 'src/exceptions/validation.exception';
import { CheckGuard } from 'src/guards/check.guard';
import { Church } from 'src/models/church.model';
import {
  CreateFellowshipInfo,
  FellowshipService,
  UpdateFellowshipInfo,
} from 'src/services/fellowship.service';
import {
  CreateFellowshipValidator,
  UpdateFellowshipValidator,
} from 'src/validators/fellowship.validators';
import { MemberService } from 'src/services/member.service';

@Controller('fellowship')
@UseGuards(CheckGuard)
export class FellowshipController {
  constructor(
    private readonly fellowshipService: FellowshipService,
    private readonly memberService: MemberService,
  ) {}

  @Get()
  @Check('fellowship.findAll')
  async findAll(@MyChurch() church: Church, @Query() query) {
    query.churchId = church.id; // Return fellowships that belong to the current church

    return this.fellowshipService.findAll(query);
  }

  @Get('/:id')
  @Check('fellowship.findById')
  async findById(@MyChurch() church: Church, @Param('id') id: string) {
    const fellowship = await this.fellowshipService.findById(id);
    if (!fellowship || fellowship.churchId !== church.id) {
      throw new NotFoundException();
    }
    return fellowship;
  }

  @Post()
  @Check('fellowship.create')
  async create(
    @MyChurch() church: Church,
    @Body(CreateFellowshipValidator) body: CreateFellowshipDto,
  ) {
    // Check if fellowship name does not exist for this church
    const existingFellowship = await this.fellowshipService.findOne({
      name: body.name,
      churchId: church.id,
    });

    if (existingFellowship) {
      throw new ValidationException({
        name: 'Fellowship name must be unique within this church',
      });
    }

    // For create, we don't accept leadership roles initially
    // as members need to be created first and assigned to this fellowship

    const info: CreateFellowshipInfo = {
      name: body.name,
      notes: body.notes,
      churchId: church.id,
    };

    const fellowship = await this.fellowshipService.create(info);
    return fellowship;
  }

  @Patch('/:id')
  @Check('fellowship.update')
  async update(
    @MyChurch() church: Church,
    @Param('id') id: string,
    @Body(UpdateFellowshipValidator) body: UpdateFellowshipDto,
  ) {
    // Verify the fellowship exists and belongs to this church
    const fellowship = await this.fellowshipService.findById(id);
    if (!fellowship || fellowship.churchId !== church.id) {
      throw new NotFoundException();
    }

    // Check if the updated name doesn't conflict with existing fellowships
    if (body.name && body.name !== fellowship.name) {
      const existingFellowship = await this.fellowshipService.findOne({
        name: body.name,
        churchId: church.id,
      });

      if (existingFellowship && existingFellowship.id !== id) {
        throw new ValidationException({
          name: 'Fellowship name must be unique within this church',
        });
      }
    }

    // Validate leadership roles if provided
    await this.validateLeadershipRoles(church.id, id, body);

    const info: UpdateFellowshipInfo = {
      name: body.name,
      notes: body.notes,
      chairmanId: body.chairmanId,
      deputyChairmanId: body.deputyChairmanId,
      secretaryId: body.secretaryId,
      treasurerId: body.treasurerId,
    };

    const updatedFellowship = await this.fellowshipService.update(id, info);
    return updatedFellowship;
  }

  @Delete('/:id')
  @Check('fellowship.deleteById')
  async deleteById(@MyChurch() church: Church, @Param('id') id: string) {
    // Verify the fellowship exists and belongs to this church
    const fellowship = await this.fellowshipService.findById(id);
    if (!fellowship || fellowship.churchId !== church.id) {
      throw new NotFoundException();
    }

    return this.fellowshipService.delete(id);
  }

  /**
   * Validates that the members assigned to leadership roles
   * are actually members of the fellowship
   */
  private async validateLeadershipRoles(
    churchId: string,
    fellowshipId: string | null,
    body: UpdateFellowshipDto,
  ) {
    const leadershipRoles = {
      chairman: body.chairmanId,
      deputyChairman: body.deputyChairmanId,
      secretary: body.secretaryId,
      treasurer: body.treasurerId,
    };

    for (const [role, memberId] of Object.entries(leadershipRoles)) {
      if (memberId) {
        // Check if member exists and belongs to the church
        const member = await this.memberService.findById(memberId);
        if (!member || member.churchId !== churchId) {
          throw new ValidationException({
            [role + 'Id']: `Invalid member ID for ${role}`,
          });
        }

        // For updates, we need to ensure the member belongs to this fellowship
        // For creation, we'll validate after creation since the fellowship doesn't exist yet
        if (fellowshipId) {
          if (member.fellowshipId !== fellowshipId) {
            throw new ValidationException({
              [role + 'Id']:
                `Member must belong to this fellowship to be assigned as ${role}`,
            });
          }
        }
      }
    }
  }
}
