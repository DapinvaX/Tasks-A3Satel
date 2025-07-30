import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  emailOrUsername: string; // Puede ser email o nombre de usuario
}
