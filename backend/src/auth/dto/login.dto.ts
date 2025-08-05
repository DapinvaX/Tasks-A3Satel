import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  emailOrUsername: string; // Puede ser email o nombre de usuario

  @IsString()
  @IsNotEmpty()
  password: string;
}
