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
import { CreateFellowshipValidator } from 'src/validators/fellowship.validators';

@Controller('fellowship')
@UseGuards(CheckGuard)
export class FellowshipController {
  constructor(private readonly fellowshipService: FellowshipService) {}

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

    const info: CreateFellowshipInfo = {
      name: body.name,
      notes: body.notes,
      churchId: church.id,
    };

    return this.fellowshipService.create(info);
  }

  @Patch('/:id')
  @Check('fellowship.update')
  async update(
    @MyChurch() church: Church,
    @Param('id') id: string,
    @Body() body: UpdateFellowshipDto,
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

    const info: UpdateFellowshipInfo = {
      name: body.name,
      notes: body.notes,
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
}
