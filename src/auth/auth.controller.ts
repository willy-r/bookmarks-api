import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto, SignUpAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signIn(@Body() dto: SignInAuthDto) {
    return this.authService.doSignIn(dto);
  }

  @Post('signup')
  async signUp(@Body() dto: SignUpAuthDto) {
    return await this.authService.doSignUp(dto);
  }
}
