import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const CreateThemeDtoKeys: (keyof CreateThemeDto)[] = ['name', 'isDisplay'];

export class CreateThemeDto {
  @ApiProperty({
    example: 'Water activities',
    description: 'Name of theme',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: true,
    description: 'Is display theme in screen city tour',
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  readonly isDisplay: boolean;

}