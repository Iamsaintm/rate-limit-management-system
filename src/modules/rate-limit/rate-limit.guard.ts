import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { RateLimitService } from './rate-limit.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private rateLimitService: RateLimitService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: { id: string } }>();
    const userId = (request.headers['x-user-id'] as string) || request.user?.id;

    if (!userId || typeof userId !== 'string') {
      throw new UnauthorizedException('User ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, subscriptionTier: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.rateLimitService.checkAndRecordRequest(
      userId,
      user.subscriptionTier,
    );

    return true;
  }
}
