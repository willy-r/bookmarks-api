import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(private databaseService: DatabaseService) {}

  doSignIn() {
    return 'I am signed in!';
  }

  doSignUp() {
    return 'I am signed up!';
  }
}
