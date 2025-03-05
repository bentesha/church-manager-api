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

@Module({
  imports: [],
  controllers: [AppController, UserController, AuthController, RoleController, ChurchController],
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
