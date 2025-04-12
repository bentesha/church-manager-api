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
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  ChurchService,
  UpdateChurchInfo,
} from '../../common/services/church.service';
import { IdHelper } from '../../helpers/id.helper';
import { AdminInfo } from '../types/admin.info';
import { MyAdmin } from '../decorators/my.admin.decorator';
import { UserService } from '../../common/services/user.service';
import { RoleService } from '../../common/services/role.service';
import { PasswordHelper } from '../../helpers/password.helper';
import { EmailService } from '../../common/services/email.service';
import { OnboardChurchDto } from '../dto/onboard.church.dto';
import { OnboardChurchValidator } from '../validators/church.validator';

@Controller('admin/church')
export class AdminChurchController {
  private readonly logger = new Logger(AdminChurchController.name);

  constructor(
    private readonly churchService: ChurchService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly passwordHelper: PasswordHelper,
    private readonly emailService: EmailService,
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
  
  @Post('onboard')
  async onboardChurch(
    @Body(new OnboardChurchValidator()) body: OnboardChurchDto,
    @MyAdmin() admin: AdminInfo,
  ) {
    this.logger.log(`Admin ${admin.username} is onboarding a new church with admin user`);

    // Check if church with the same name or domain already exists
    const existingChurchByName = await this.churchService.findOne({ name: body.name });
    if (existingChurchByName) {
      throw new ConflictException(`Church with name "${body.name}" already exists`);
    }
    
    const existingChurchByDomain = await this.churchService.findOne({ domainName: body.domainName });
    if (existingChurchByDomain) {
      throw new ConflictException(`Church with domain "${body.domainName}" already exists`);
    }
    
    // Check if user with the same email already exists
    const existingUser = await this.userService.findOne({ email: body.adminEmail });
    if (existingUser) {
      throw new ConflictException(`User with email "${body.adminEmail}" already exists`);
    }

    // Generate a random registration number
    const registrationNumber = `CHURCH-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Step 1: Create the church
    const church = await this.churchService.create({
      name: body.name,
      domainName: body.domainName,
      registrationNumber,
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
    });

    // Step 2: Define default admin role actions
    const defaultAdminActions = [
      'user.findAll',
      'user.findById',
      'user.create',
      'user.update',
      'user.delete',
      'role.findAll',
      'role.findById',
      'fellowship.findById',
      'fellowship.findAll',
      'fellowship.create',
      'fellowship.update',
      'member.findAll',
      'member.findById',
      'member.create',
      'member.update',
      'member.deleteById',
      'opportunity.findAll',
      'opportunity.findById',
      'opportunity.create',
      'opportunity.update',
      'opportunity.deleteById',
      'envelope.findAll',
      'envelope.findById',
      'envelope.findByNumber',
      'envelope.findAvailable',
      'envelope.create',
      'envelope.delete',
      'envelope.assign',
      'envelope.release',
      'envelope.getHistory',
    ];

    // Step 3: Create the admin role with permissions
    const adminRole = await this.roleService.create({
      name: 'admin',
      churchId: church.id,
      description: 'Administrator with full access',
      actions: defaultAdminActions,
    });

    // Step 4: Hash the password for the admin user
    const { hash, salt } = this.passwordHelper.hashPassword(body.adminPassword);

    // Step 5: Create the admin user
    const adminUser = await this.userService.create({
      name: body.adminName,
      email: body.adminEmail,
      phoneNumber: body.adminPhone || null,
      churchId: church.id,
      roleId: adminRole.id,
      passwordHash: hash,
      passwordSalt: salt,
    });

    // Step 6: Send onboarding email if sendEmail is true (default)
    if (body.sendEmail !== false) {
      const loginLink = this.churchService.getLoginLink(church);
      await this.emailService.sendOnboardEmail({
        to: adminUser.email,
        name: adminUser.name,
        churchName: church.name,
        email: adminUser.email,
        password: body.adminPassword,
        domain: body.domainName,
        loginLink: loginLink,
      });
    }

    // Return the created resources
    return {
      church,
      admin: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
      }
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateChurchDto: UpdateChurchInfo,
    @MyAdmin() admin: AdminInfo,
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
