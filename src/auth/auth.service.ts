import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  doSignIn() {
    throw new NotImplementedException();
  }

  doSignUp() {
    throw new NotImplementedException();
  }
}
