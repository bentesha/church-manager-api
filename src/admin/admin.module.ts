import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminJwtMiddleware } from './middleware/admin.jwt.middleware';
import { Config } from '../config';

// Import services used by admin controllers
import { ChurchService } from '../services/church.service';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { SessionService } from '../services/session.service';
import { MemberService } from '../services/member.service';
import { FellowshipService } from '../services/fellowship.service';
import { OpportunityService } from '../services/opportunity.service';
import { EnvelopeService } from '../services/envelope.service';

// Import helpers
import { DateHelper } from '../helpers/date.helper';
import { IdHelper } from '../helpers/id.helper';
import { PasswordHelper } from '../helpers/password.helper';

// Import admin controllers
import { AdminChurchController } from './controllers/admin.church.controller';
import { AdminUserController } from './controllers/admin.user.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: Config) => ({
        secret: config.admin?.jwtSecret || 'default-admin-secret', // Fallback for testing
        signOptions: { expiresIn: '1h' },
      }),
      inject: [Config],
      imports: [AdminModule],
    }),
  ],
  controllers: [
    AdminChurchController,
    AdminUserController,
    // Add other admin controllers as they are created
  ],
  providers: [
    // Core services and helpers that admin controllers need
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
  ],
  exports: [
    Config, // Export Config for use in JwtModule
  ],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the JWT middleware to all routes under the admin module
    consumer
      .apply(AdminJwtMiddleware)
      .forRoutes('admin/*path');
  }
}