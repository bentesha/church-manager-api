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
  Query,
} from '@nestjs/common';
import { 
  UserService, 
  CreateUserInfo, 
  UpdateUserInfo 
} from '../../services/user.service';
import { PasswordHelper } from '../../helpers/password.helper';
import { AdminInfo } from '../types/admin.info';
import { MyAdmin } from '../decorators/my.admin.decorator';

@Controller('admin/user')
export class AdminUserController {
  private readonly logger = new Logger(AdminUserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly passwordHelper: PasswordHelper,
  ) {}

  @Get()
  async findAll(@Query() query: any, @MyAdmin() admin: AdminInfo) {
    this.logger.log(`Admin ${admin.username} is fetching users with query: ${JSON.stringify(query)}`);
    
    // Default to not showing deleted users unless specifically requested
    if (query.isDeleted === undefined) {
      query.isDeleted = false;
    }
    
    return this.userService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @MyAdmin() admin: AdminInfo) {
    this.logger.log(`Admin ${admin.username} is fetching user with id ${id}`);
    
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  @Post()
  async create(@Body() createUserDto: any, @MyAdmin() admin: AdminInfo) {
    this.logger.log(`Admin ${admin.username} is creating a new user`);
    
    // Generate password hash and salt
    const { hash, salt } = this.passwordHelper.hashPassword(createUserDto.password);
    
    const createUserInfo: CreateUserInfo = {
      name: createUserDto.name,
      email: createUserDto.email,
      phoneNumber: createUserDto.phoneNumber,
      churchId: createUserDto.churchId,
      roleId: createUserDto.roleId,
      passwordHash: hash,
      passwordSalt: salt,
    };
    
    return this.userService.create(createUserInfo);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: any,
    @MyAdmin() admin: AdminInfo
  ) {
    this.logger.log(`Admin ${admin.username} is updating user with id ${id}`);
    
    const updateInfo: UpdateUserInfo = {
      name: updateUserDto.name,
      phoneNumber: updateUserDto.phoneNumber,
      isActive: updateUserDto.isActive,
      roleId: updateUserDto.roleId,
    };
    
    // Only update password if provided
    if (updateUserDto.password) {
      const { hash, salt } = this.passwordHelper.hashPassword(updateUserDto.password);
      updateInfo.passwordHash = hash;
      updateInfo.passwordSalt = salt;
    }
    
    const user = await this.userService.update(id, updateInfo);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @MyAdmin() admin: AdminInfo) {
    this.logger.log(`Admin ${admin.username} is deleting user with id ${id}`);
    
    // Use soft delete for users
    const user = await this.userService.softDelete(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

}