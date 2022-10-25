import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto, SignUpAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() dto: SignInAuthDto) {
    return await this.authService.doSignIn(dto);
  }

  @Post('signup')
  async signUp(@Body() dto: SignUpAuthDto) {
    return await this.authService.doSignUp(dto);
  }
}
