import { SubscriptionTier } from '@prisma/client';

export const SUBSCRIPTION_QUOTAS: Record<
  SubscriptionTier,
  { hourly: number; daily: number }
> = {
  [SubscriptionTier.FREE]: {
    hourly: 100,
    daily: 1000,
  },
  [SubscriptionTier.STANDARD]: {
    hourly: 500,
    daily: 10000,
  },
  [SubscriptionTier.PREMIUM]: {
    hourly: 2000,
    daily: 100000,
  },
};
