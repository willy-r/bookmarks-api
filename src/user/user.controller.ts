import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  async editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return await this.userService.editUser(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteUser(@GetUser('id') userId: number) {
    return await this.userService.deleteUser(userId);
  }
}
