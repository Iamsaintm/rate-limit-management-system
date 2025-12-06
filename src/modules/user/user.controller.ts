import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  async getUserByIdWithQuota(@Param('id') id: string): Promise<{
    id: string;
    email: string;
    subscriptionTier: string;
    createdAt: Date;
    updatedAt: Date;
    quota: {
      hourly: { used: number; limit: number; remaining: number };
      daily: { used: number; limit: number; remaining: number };
    };
  }> {
    return this.userService.findUserByIdWithQuota(id);
  }
}
