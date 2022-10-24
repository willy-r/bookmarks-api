import { Controller, NotImplementedException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signIn() {
    return this.authService.doSignIn();
  }

  @Post('signup')
  signUp() {
    return this.authService.doSignUp();
  }
}
