import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombreUsuario: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  apellido: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  preguntaSeguridad: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  respuestaSeguridad: string;
}
