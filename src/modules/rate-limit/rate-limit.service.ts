import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionTier } from '@prisma/client';
import { SUBSCRIPTION_QUOTAS } from '../../common/constants/subscription-tiers.constants';

@Injectable()
export class RateLimitService {
  constructor(private prisma: PrismaService) {}

  async checkAndRecordRequest(
    userId: string,
    subscriptionTier: SubscriptionTier,
  ): Promise<void> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const quotas = SUBSCRIPTION_QUOTAS[subscriptionTier];

    let counter = await this.prisma.rateLimitCounter.upsert({
      where: { userId },
      create: {
        userId,
        hourlyStart: now,
        dailyStart: now,
      },
      update: {},
    });

    if (counter.hourlyStart < oneHourAgo) {
      counter = await this.prisma.rateLimitCounter.update({
        where: { userId },
        data: {
          hourlyCount: 0,
          hourlyStart: now,
        },
      });
    }

    if (counter.dailyStart < oneDayAgo) {
      counter = await this.prisma.rateLimitCounter.update({
        where: { userId },
        data: {
          dailyCount: 0,
          dailyStart: now,
        },
      });
    }

    if (counter.hourlyCount >= quotas.hourly) {
      throw new HttpException(
        'Hourly quota exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (counter.dailyCount >= quotas.daily) {
      throw new HttpException(
        'Daily quota exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.prisma.rateLimitCounter.update({
      where: { userId },
      data: {
        hourlyCount: { increment: 1 },
        dailyCount: { increment: 1 },
      },
    });
  }

  async getRequestCounts(
    userId: string,
  ): Promise<{ hourly: number; daily: number }> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const counter = await this.prisma.rateLimitCounter.findUnique({
      where: { userId },
    });

    if (!counter) {
      return { hourly: 0, daily: 0 };
    }

    let hourlyCount = counter.hourlyCount;
    let dailyCount = counter.dailyCount;

    if (counter.hourlyStart < oneHourAgo) {
      hourlyCount = 0;
    }

    if (counter.dailyStart < oneDayAgo) {
      dailyCount = 0;
    }

    return { hourly: hourlyCount, daily: dailyCount };
  }
}
