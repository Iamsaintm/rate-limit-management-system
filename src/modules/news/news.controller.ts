import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsResponseDto } from './dto/news-response.dto';
import { RateLimitGuard } from '../rate-limit/rate-limit.guard';
import { UseGuards } from '@nestjs/common';

@Controller('news')
@UseGuards(RateLimitGuard)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  getLatestNews(): NewsResponseDto[] {
    return this.newsService.getLatestNews();
  }
}
