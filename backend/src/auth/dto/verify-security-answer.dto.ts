import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class VerifySecurityAnswerDto {
  @IsString()
  @IsNotEmpty()
  emailOrUsername: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  respuesta: string;
}
