import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export const CreateThemeDtoKeys: (keyof CreateThemeDto)[] = ['name'];

export class CreateThemeDto {
  @ApiProperty({
    example: 'Water activities',
    description: 'Name of theme',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}