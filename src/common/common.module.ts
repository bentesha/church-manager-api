import { Module } from '@nestjs/common';
import { Config } from '../config';
import { DateHelper } from '../helpers/date.helper';
import { IdHelper } from '../helpers/id.helper';
import { PasswordHelper } from '../helpers/password.helper';
import { ChurchService } from './services/church.service';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { SessionService } from './services/session.service';
import { MemberService } from './services/member.service';
import { FellowshipService } from './services/fellowship.service';
import { OpportunityService } from './services/opportunity.service';
import { EnvelopeService } from './services/envelope.service';
import { EmailService } from './services/email.service';
import { PasswordResetTokenService } from './services/password.reset.token.service';
import { AuthService } from './services/auth.service';

/**
 * Common module that provides shared services across the application
 */
@Module({
  providers: [
    // Configuration
    Config,
    
    // Helpers
    DateHelper,
    IdHelper,
    PasswordHelper,
    
    // Services
    ChurchService,
    UserService,
    RoleService,
    SessionService,
    MemberService,
    FellowshipService,
    OpportunityService,
    EnvelopeService,
    EmailService,
    PasswordResetTokenService,
    AuthService,
    RoleService,
    PasswordResetTokenService,
  ],
  exports: [
    // Export all providers so they're available to importing modules
    Config,
    DateHelper,
    IdHelper,
    PasswordHelper,
    ChurchService,
    UserService,
    RoleService,
    SessionService,
    MemberService,
    FellowshipService,
    OpportunityService,
    EnvelopeService,
    EmailService,
    PasswordResetTokenService,
    AuthService,
  ],
})
export class CommonModule {}