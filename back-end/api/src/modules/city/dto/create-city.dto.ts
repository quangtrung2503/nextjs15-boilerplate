import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export const CreateCityDtoKeys: (keyof CreateCityDto)[] = ['name'];

export class CreateCityDto {
  @ApiProperty({
    example: 'Ohio',
    description: 'Name of city',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}