import { Controller, Get } from '@nestjs/common';
import { MyChurch } from 'src/decorators/my.church.decorator';
import { Church } from 'src/models/church.model';

@Controller('church')
export class ChurchController {
  @Get('/me')
  async getCurrent(@MyChurch() church: Church) {
    return church;
  }
}
