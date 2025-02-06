import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const CreateDestinationDtoKeys: (keyof CreateDestinationDto)[] = ['name', 'isFeature'];

export class CreateDestinationDto {
  @ApiProperty({
    example: 'Biscayne Bay',
    description: 'Name of destination',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'https://example.com/image1.jpg',
    description: 'Image of destination',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly image: string;

  @ApiProperty({
    example: true,
    description: 'Is feature destination',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly isFeature: boolean;
}