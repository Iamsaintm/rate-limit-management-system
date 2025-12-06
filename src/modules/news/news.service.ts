import { Injectable } from '@nestjs/common';
import { NewsResponseDto } from './dto/news-response.dto';

@Injectable()
export class NewsService {
  private readonly mockNews: NewsResponseDto[] = [
    {
      id: '1',
      title: 'Breaking: New Technology Revolutionizes Industry',
      content:
        'A groundbreaking new technology has been developed that promises to revolutionize the entire industry. Experts say this could change everything we know about how we work and live.',
      author: 'John Doe',
      publishedAt: new Date(),
      category: 'Technology',
    },
    {
      id: '2',
      title: 'Global Markets Reach All-Time High',
      content:
        'Stock markets around the world have reached unprecedented heights, with analysts predicting continued growth in the coming months.',
      author: 'Jane Smith',
      publishedAt: new Date(Date.now() - 3600000),
      category: 'Finance',
    },
    {
      id: '3',
      title: 'Scientists Discover New Species in Deep Ocean',
      content:
        'Marine biologists have discovered a previously unknown species of deep-sea creature that could provide insights into evolution and biodiversity.',
      author: 'Dr. Sarah Johnson',
      publishedAt: new Date(Date.now() - 7200000),
      category: 'Science',
    },
    {
      id: '4',
      title: 'Sports: Championship Game Breaks Viewership Records',
      content:
        'The championship game has broken all previous viewership records, with millions tuning in from around the world to watch the historic event.',
      author: 'Mike Wilson',
      publishedAt: new Date(Date.now() - 10800000),
      category: 'Sports',
    },
    {
      id: '5',
      title: 'Climate Summit Reaches Historic Agreement',
      content:
        'World leaders have reached a historic agreement on climate action, committing to ambitious new targets for reducing carbon emissions.',
      author: 'Emily Brown',
      publishedAt: new Date(Date.now() - 14400000),
      category: 'Environment',
    },
  ];

  getLatestNews(): NewsResponseDto[] {
    return [...this.mockNews].sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
    );
  }
}
