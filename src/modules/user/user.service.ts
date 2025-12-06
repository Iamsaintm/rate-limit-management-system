import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionTier } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { RateLimitService } from '../rate-limit/rate-limit.service';
import { SUBSCRIPTION_QUOTAS } from '../../common/constants/subscription-tiers.constants';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private rateLimitService: RateLimitService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, subscriptionTier = SubscriptionTier.FREE } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        subscriptionTier,
      },
    });

    return user;
  }

  async findUserByIdWithQuota(id: string): Promise<{
    id: string;
    email: string;
    subscriptionTier: SubscriptionTier;
    createdAt: Date;
    updatedAt: Date;
    quota: {
      hourly: { used: number; limit: number; remaining: number };
      daily: { used: number; limit: number; remaining: number };
    };
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const quotas = SUBSCRIPTION_QUOTAS[user.subscriptionTier];
    const counts = await this.rateLimitService.getRequestCounts(id);

    return {
      ...user,
      quota: {
        hourly: {
          used: counts.hourly,
          limit: quotas.hourly,
          remaining: Math.max(0, quotas.hourly - counts.hourly),
        },
        daily: {
          used: counts.daily,
          limit: quotas.daily,
          remaining: Math.max(0, quotas.daily - counts.daily),
        },
      },
    };
  }
}
