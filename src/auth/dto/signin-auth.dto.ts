import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// As we are using class-transformer and class-validator
// to validate input data on our DTO, we need to transform
// it from a interface to a class, but will be a interface.

export class SignInAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
