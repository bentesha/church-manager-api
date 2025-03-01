import {
  Body,
  Controller,
  Post,
  Req,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/services/user.service';
import { AuthService, LoginInfo } from 'src/services/auth.service';
import { SessionService } from 'src/services/session.service';
import { Session } from 'src/models/session.model';
import { MySession } from 'src/decorators/my.session.decorator';
import { User } from 'src/models/user.model';
import { Me } from 'src/decorators/me.decorator';
import { RoleService } from 'src/services/role.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
  ) {}

  @Post('/login')
  async login(@Body() body: any, @Req() req: Request) {
    const { username, password } = body;

    // Extract IP Address and User-Agent
    const ipAddress = req.ip ?? null;
    const userAgent = req.headers['user-agent'] || null;

    // Prepare login info
    const loginInfo: LoginInfo = { username, password, ipAddress, userAgent };

    // Authenticate using AuthService
    const session = await this.authService.login(loginInfo);
    if (!session) {
      throw new BadRequestException('Invalid credentials');
    }

    // Fetch user details
    const user = await this.userService.findById(session.userId);

    // Get all actions allowed to allowed to the user's role
    const roleActions = await this.roleService.getRoleActions(user!.roleId);

    // Return session token and user details
    return {
      token: session.token,
      user,
      allowedActions: roleActions.map((item) => item.action),
    };
  }

  @Post('/logout')
  async logout(@MySession() session: Session) {
    await this.sessionService.deactivate(session.id);
    return { message: 'Logged out successfully' };
  }

  @Get('/me')
  async me(@Me() user: User) {
    const roleActions = await this.roleService.getRoleActions(user.roleId);
    return {
      user,
      allowedActions: roleActions.map((item) => item.action),
    };
  }
}
