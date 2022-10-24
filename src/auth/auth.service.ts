import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SignInAuthDto, SignUpAuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private databaseService: DatabaseService) {}

  doSignIn(dto: SignInAuthDto) {
    console.log(dto);
    return 'I am signed in!';
  }

  async doSignUp(dto: SignUpAuthDto) {
    // Generate password hash.
    const hashPassword = await argon.hash(dto.password)
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
  }
}
