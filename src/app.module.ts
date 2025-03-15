import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChurchService } from './services/church.service';
import { DateHelper } from './helpers/date.helper';
import { IdHelper } from './helpers/id.helper';
import { UserService } from './services/user.service';
import { SessionService } from './services/session.service';
import { UserController } from './controllers/user.controller';
import { PasswordHelper } from './helpers/password.helper';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { Config } from './config';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';
import { ChurchController } from './controllers/church.controller';
import { FellowshipService } from './services/fellowship.service';
import { FellowshipController } from './controllers/fellowship.controller';
import { MemberService } from './services/member.service';
import { MemberController } from './controllers/member.controller';
import { OpportunityService } from './services/opportunity.service';
import { OpportunityController } from './controllers/opportunity.controller';
import { EnvelopeService } from './services/envelope.service';
import { EnvelopeController } from './controllers/envelope.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController, AuthController, RoleController, ChurchController, FellowshipController, MemberController, OpportunityController, EnvelopeController],
  providers: [
    AppService,
    ChurchService,
    DateHelper,
    IdHelper,
    UserService,
    SessionService,
    PasswordHelper,
    AuthService,
    Config,
    RoleService,
    FellowshipService,
    MemberService,
    OpportunityService,
    EnvelopeService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'auth/login', method: RequestMethod.POST })
      .forRoutes('*');
  }
}
