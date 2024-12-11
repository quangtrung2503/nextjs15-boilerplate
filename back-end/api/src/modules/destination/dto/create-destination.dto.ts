import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export const CreateDestinationDtoKeys: (keyof CreateDestinationDto)[] = ['name'];

export class CreateDestinationDto {
  @ApiProperty({
    example: 'Biscayne Bay',
    description: 'Name of destination',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}