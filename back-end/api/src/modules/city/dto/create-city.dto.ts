import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export const CreateCityDtoKeys: (keyof CreateCityDto)[] = ['name', 'image', 'description', 'tagIds'];

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

  @ApiProperty({
    example: [1, 2, 3],
    description: 'The id of the tag',
    required: true,
    isArray: true,
    type: Number,
  })
  @IsNotEmpty({ each: true })
  @IsNumber({}, { each: true })
  readonly tagIds: number[];
}