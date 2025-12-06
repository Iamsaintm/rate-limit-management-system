import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './modules/config/config.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module';
import { NewsModule } from './modules/news/news.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    UserModule,
    RateLimitModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
