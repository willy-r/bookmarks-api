import { Injectable, NotImplementedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(private databaseService: DatabaseService) {}

  doSignIn() {
    throw new NotImplementedException();
  }

  doSignUp() {
    throw new NotImplementedException();
  }
}
