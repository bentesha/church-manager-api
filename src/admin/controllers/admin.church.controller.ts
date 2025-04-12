import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ChurchService, CreateChurchInfo, UpdateChurchInfo } from '../../services/church.service';
import { IdHelper } from '../../helpers/id.helper';
import { AdminInfo } from '../types/admin.info';
import { MyAdmin } from '../decorators/my.admin.decorator';

@Controller('admin/church')
export class AdminChurchController {
  private readonly logger = new Logger(AdminChurchController.name);

  constructor(
    private readonly churchService: ChurchService,
    private readonly idHelper: IdHelper,
  ) {}

  @Get()
  async findAll(@MyAdmin() admin: AdminInfo) {
    this.logger.log(`Admin ${admin.username} is fetching all churches`);
    
    return this.churchService.findAll({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @MyAdmin() admin: AdminInfo) {
    this.logger.log(`Admin ${admin.username} is fetching church with id ${id}`);
    
    const church = await this.churchService.findById(id);
    if (!church) {
      throw new NotFoundException(`Church with ID ${id} not found`);
    }
    
    return church;
  }

  @Post()
  async create(@Body() createChurchDto: CreateChurchInfo, @MyAdmin() admin: AdminInfo) {
    this.logger.log(`Admin ${admin.username} is creating a new church`);
    
    return this.churchService.create(createChurchDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateChurchDto: UpdateChurchInfo,
    @MyAdmin() admin: AdminInfo
  ) {
    this.logger.log(`Admin ${admin.username} is updating church with id ${id}`);
    
    const church = await this.churchService.update(id, updateChurchDto);
    if (!church) {
      throw new NotFoundException(`Church with ID ${id} not found`);
    }
    
    return church;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @MyAdmin() admin: AdminInfo) {
    this.logger.log(`Admin ${admin.username} is deleting church with id ${id}`);
    
    const church = await this.churchService.delete(id);
    if (!church) {
      throw new NotFoundException(`Church with ID ${id} not found`);
    }
    
    return church;
  }
}