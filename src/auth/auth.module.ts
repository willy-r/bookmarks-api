import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({})], // Empty to be customized in other place.
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
