import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessionService } from 'src/common/services/session.service';
import { UserService } from 'src/common/services/user.service';
import { ChurchService } from 'src/common/services/church.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly churchService: ChurchService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException();
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const session = await this.sessionService.findOne({
      token,
      isActive: true,
    });
    const isValidToken =
      session && session.isActive && new Date(session.expiresAt) > new Date();
    if (!isValidToken) {
      throw new ForbiddenException();
    }

    const user = await this.userService.findById(session.userId);
    const church = await this.churchService.findById(user!.churchId);

    // Attach session, user and church to the request object
    (req as any).session = session;
    (req as any).user = user;
    (req as any).church = church;

    next();
  }
}
