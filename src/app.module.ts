import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthMiddleware } from './middleware/auth.middleware';
import { RoleController } from './controllers/role.controller';
import { ChurchController } from './controllers/church.controller';
import { FellowshipController } from './controllers/fellowship.controller';
import { MemberController } from './controllers/member.controller';
import { OpportunityController } from './controllers/opportunity.controller';
import { EnvelopeController } from './controllers/envelope.controller';
import { NotificationController } from './controllers/notification.controller';
import { AdminModule } from './admin/admin.module';
import { CommonModule } from './common/common.module';
import { InterestController } from './controllers/interest.controller';
import { ImageController } from './controllers/image.controller';

@Module({
  imports: [CommonModule, AdminModule],
  controllers: [
    AppController,
    UserController,
    AuthController,
    RoleController,
    ChurchController,
    FellowshipController,
    MemberController,
    OpportunityController,
    EnvelopeController,
    NotificationController,
    InterestController,
    ImageController,
  ],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/admin/*path')
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/forgot-password', method: RequestMethod.POST },
        { path: 'auth/verify-reset-token/:token', method: RequestMethod.GET },
        { path: 'auth/reset-password', method: RequestMethod.POST },
        { path: 'image/:filename', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
