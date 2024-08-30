import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  readonly birthDate?: string;
  readonly firstName?: string;
  readonly lastName?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
