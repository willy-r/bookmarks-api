import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async editUser(userId: number, dto: EditUserDto): Promise<User> {
    const user = await this.databaseService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    delete user.hashPassword;
    return user;
  }

  async deleteUser(userId: number): Promise<null> {
    await this.databaseService.user.delete({
      where: {
        id: userId,
      },
    });
    return null;
  }
}
