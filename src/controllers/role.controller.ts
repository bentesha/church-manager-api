import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { Check } from 'src/decoractors/check.decorator';
import { MyChurch } from 'src/decorators/my.church.decorator';
import { Church } from 'src/models/church.model';
import { RoleService } from 'src/common/services/role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Check('role.findAll')
  async findAll(@MyChurch() church: Church, @Query() query: any) {
    query.churchId = church.id;
    return this.roleService.findAll(query);
  }

  @Get('/:id')
  @Check('role.findById')
  async findById(@MyChurch() church: Church, @Param('id') id: string) {
    const role = await this.roleService.findById(id);
    if (!role || role.churchId !== church.id) {
      throw new NotFoundException();
    }
    return role;
  }
}
