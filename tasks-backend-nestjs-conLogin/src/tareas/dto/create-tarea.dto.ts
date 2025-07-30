import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, MaxLength } from 'class-validator';

export class CreateTareaDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(75)
  titulo: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsOptional()
  @IsBoolean()
  completada?: boolean;
}
