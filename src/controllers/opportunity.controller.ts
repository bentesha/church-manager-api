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
  CreateOpportunityDto,
  UpdateOpportunityDto,
} from 'src/dto/opportunity.dto';
import { ValidationException } from 'src/exceptions/validation.exception';
import { CheckGuard } from 'src/guards/check.guard';
import { Church } from 'src/models/church.model';
import {
  CreateOpportunityInfo,
  OpportunityService,
  UpdateOpportunityInfo,
} from 'src/common/services/opportunity.service';
import { CreateOpportunityValidator } from 'src/validators/opportunity.validators';

@Controller('opportunity')
@UseGuards(CheckGuard)
export class OpportunityController {
  constructor(private readonly opportunityService: OpportunityService) {}

  @Get()
  @Check('opportunity.findAll')
  async findAll(@MyChurch() church: Church, @Query() query) {
    query.churchId = church.id; // Return opportunities that belong to the current church

    return this.opportunityService.findAll(query);
  }

  @Get('/:id')
  @Check('opportunity.findById')
  async findById(@MyChurch() church: Church, @Param('id') id: string) {
    const opportunity = await this.opportunityService.findById(id);
    if (!opportunity || opportunity.churchId !== church.id) {
      throw new NotFoundException();
    }
    return opportunity;
  }

  @Post()
  @Check('opportunity.create')
  async create(
    @MyChurch() church: Church,
    @Body(CreateOpportunityValidator) body: CreateOpportunityDto,
  ) {
    // Check if opportunity name does not exist for this church
    const existingOpportunity = await this.opportunityService.findOne({
      name: body.name,
      churchId: church.id,
    });

    if (existingOpportunity) {
      throw new ValidationException({
        name: 'Opportunity name must be unique within this church',
      });
    }

    const info: CreateOpportunityInfo = {
      name: body.name,
      description: body.description,
      churchId: church.id,
    };

    return this.opportunityService.create(info);
  }

  @Patch('/:id')
  @Check('opportunity.update')
  async update(
    @MyChurch() church: Church,
    @Param('id') id: string,
    @Body() body: UpdateOpportunityDto,
  ) {
    // Verify the opportunity exists and belongs to this church
    const opportunity = await this.opportunityService.findById(id);
    if (!opportunity || opportunity.churchId !== church.id) {
      throw new NotFoundException();
    }

    // Check if the updated name doesn't conflict with existing opportunities
    if (body.name && body.name !== opportunity.name) {
      const existingOpportunity = await this.opportunityService.findOne({
        name: body.name,
        churchId: church.id,
      });

      if (existingOpportunity && existingOpportunity.id !== id) {
        throw new ValidationException({
          name: 'Opportunity name must be unique within this church',
        });
      }
    }

    const info: UpdateOpportunityInfo = {
      name: body.name,
      description: body.description,
    };

    const updatedOpportunity = await this.opportunityService.update(id, info);
    return updatedOpportunity;
  }

  @Delete('/:id')
  @Check('opportunity.deleteById')
  async deleteById(@MyChurch() church: Church, @Param('id') id: string) {
    // Verify the opportunity exists and belongs to this church
    const opportunity = await this.opportunityService.findById(id);
    if (!opportunity || opportunity.churchId !== church.id) {
      throw new NotFoundException();
    }

    return this.opportunityService.delete(id);
  }
}
