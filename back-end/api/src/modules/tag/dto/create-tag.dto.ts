import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const CreateTagDtoKeys: (keyof CreateTagDto)[] = ['name', 'icon', 'color'];

export class CreateTagDto {
  @ApiProperty({
    example: 'Public Transportations',
    description: 'Name of tag',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'https://example.com/image1.jpg',
    description: 'Icon of tag',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly icon?: string;

  @ApiProperty({
    example: '#FF0000',
    description: 'Color of tag',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly color: string;
}
