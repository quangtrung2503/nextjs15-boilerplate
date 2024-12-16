import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export const CreateCityDtoKeys: (keyof CreateCityDto)[] = ['name', 'image', 'description'];

export class CreateCityDto {
  @ApiProperty({
    example: 'Ohio',
    description: 'Name of city',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'https://example.com/image1.jpg',
    description: 'Image of city',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly image: string;

  @ApiProperty({
    example: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint',
    description: 'Description of city',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}