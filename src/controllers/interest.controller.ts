import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InterestService } from 'src/common/services/interest.service';
import { Check } from 'src/decoractors/check.decorator';
import { CheckGuard } from 'src/guards/check.guard';

@Controller('interest')
@UseGuards(CheckGuard)
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @Get()
  @Check('interest.findAll')
  findAll(@Query() query: any) {
    return this.interestService.findAll(query);
  }
}
