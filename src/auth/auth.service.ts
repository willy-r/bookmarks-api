import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { DatabaseService } from '../database/database.service';
import { SignInAuthDto, SignUpAuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private databaseService: DatabaseService) {}

  async doSignIn(dto: SignInAuthDto) {
    // Find the user by email.
    // If user does not exist throw exception.
    const user = await this.databaseService.user.findUnique({
      where: {
        email: dto.email,
      }
    });
    // Guard condition.
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // Compare password.
    // If password incorrect throw exception.
    const passwordMatches = await argon.verify(user.hashPassword, dto.password);
    if (!passwordMatches) {
      throw new ForbiddenException('Password is incorrect');
    }
    
    // Send back the user.
    delete user.hashPassword;
    return user;
  }

  async doSignUp(dto: SignUpAuthDto) {
    // Generate password hash.
    const hashPassword = await argon.hash(dto.password)
    try {
      // Save user on db.
      const user = await this.databaseService.user.create({
        data: {
          email: dto.email,
          hashPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
        }
      });
      // Delete hash from returned user.
      delete user.hashPassword;
      // Return the saved user.
      return user;
    } catch (err) {
      // Treats unique constraint from Prisma.
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ForbiddenException('Credentials not accepted')
      }
      throw err;
    }
  }
}
