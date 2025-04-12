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
import { CreateUserDto, UpdateUserDto } from 'src/dto/user.dto';
import { ValidationException } from 'src/exceptions/validation.exception';
import { CheckGuard } from 'src/guards/check.guard';
import { PasswordHelper } from 'src/helpers/password.helper';
import { Church } from 'src/models/church.model';
import {
  CreateUserInfo,
  UpdateUserInfo,
  UserService,
} from 'src/services/user.service';
import { CreateUserValidator } from 'src/validators/user.validators';
import { EmailService } from 'src/services/email.service';

@Controller('user')
@UseGuards(CheckGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly passwordHelper: PasswordHelper,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  @Check('user.findAll')
  async findAll(@MyChurch() church: Church, @Query() query) {
    query.churchId = church.id; // Return users that belong to the current church
    query.isDeleted = query.isDeleted ?? false; // Omit soft deleted entries by default

    return this.userService.findAll(query);
  }

  @Get('/:id')
  @Check('user.findById')
  async findById(@MyChurch() church: Church, @Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user || user.churchId !== church.id) {
      throw new NotFoundException();
    }
    return user;
  }

  @Post()
  @Check('user.create')
  async create(
    @MyChurch() church: Church,
    @Body(CreateUserValidator) body: CreateUserDto,
  ) {
    // Check if the user email's domain matches the church domain
    const emailDomain = body.email.split('@')[1];
    if (emailDomain !== church.domainName) {
      throw new ValidationException({
        email: `Email domain does not match church domain`,
      });
    }

    // Check if email does not exist
    const existingUserByEmail = await this.userService.findOne({
      email: body.email,
    });
    if (existingUserByEmail) {
      throw new ValidationException({
        email: 'Email address must be unique',
      });
    }

    // Check if phoneNumber does not exist
    if (body.phoneNumber) {
      const existingUserByPhone = await this.userService.findOne({
        phoneNumber: body.phoneNumber,
        churchId: church.id,
      });
      if (existingUserByPhone) {
        throw new ValidationException({
          phoneNumber: 'Phone number must be unique',
        });
      }
    }

    // Generate password hash and salt using PasswordHelper
    const { hash, salt } = this.passwordHelper.hashPassword(body.password);

    const info: CreateUserInfo = {
      name: body.name,
      email: body.email,
      phoneNumber: body.phoneNumber,
      churchId: church.id,
      roleId: body.roleId,
      passwordHash: hash,
      passwordSalt: salt,
    };

    const user = await this.userService.create(info);
    
    // Send email notification if requested
    if (body.sendEmail === true) {
      await this.emailService.sendNewUserEmail({
        to: user.email,
        name: user.name,
        churchName: church.name,
        email: user.email,
        password: body.password,
        loginLink: `${church.domainName}/login`,
      });
    }

    return user;
  }

  @Patch('/:id')
  @Check('user.update')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    // Todo: Check if phoneNumber does not exist

    const info: UpdateUserInfo = {
      name: body.name,
      phoneNumber: body.phoneNumber,
      isActive: body.isActive,
      roleId: body.roleId,
    };

    if (body.password) {
      const { salt, hash } = this.passwordHelper.hashPassword(body.password);
      info.passwordHash = hash;
      info.passwordSalt = salt;
    }

    const user = await this.userService.update(id, info);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Delete('/:id')
  @Check('user.deleteById')
  async deleteById(@Param('id') id: string) {
    const user = await this.userService.softDelete(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
