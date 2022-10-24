import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signIn(@Body() dto: AuthDto) {
    console.log(dto);
    return this.authService.doSignIn();
  }

  @Post('signup')
  signUp() {
    return this.authService.doSignUp();
  }
}
