import { SubscriptionTier } from '@prisma/client';

export class CreateUserDto {
  email: string;
  subscriptionTier?: SubscriptionTier;
}
