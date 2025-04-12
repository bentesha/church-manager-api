import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminMiddleware } from './middleware/admin.middleware';
import { CommonModule } from '../common/common.module';
import { Config } from '../config';
import { AdminChurchController } from './controllers/admin.church.controller';
import { AdminUserController } from './controllers/admin.user.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: Config) => ({
        secret: config.admin?.jwtSecret,
        signOptions: { expiresIn: '1h' },
      }),
      imports: [CommonModule],
      inject: [Config],
    }),
    CommonModule,
  ],
  controllers: [AdminChurchController, AdminUserController],
  providers: [],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the JWT middleware to all routes under the admin module
    consumer.apply(AdminMiddleware).forRoutes('admin/*path');
  }
}
