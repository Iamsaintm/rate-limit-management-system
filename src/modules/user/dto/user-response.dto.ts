import { SubscriptionTier } from '@prisma/client';

export class UserResponseDto {
  id: string;
  email: string;
  subscriptionTier: SubscriptionTier;
  createdAt: Date;
  updatedAt: Date;
}
