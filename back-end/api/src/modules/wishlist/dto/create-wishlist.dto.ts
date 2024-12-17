import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export const CreateWishlistDtoKeys: (keyof CreateWishlistDto)[] = ['tourId'];

export class CreateWishlistDto {
  @ApiProperty({
    example: 1,
    description: 'The id of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly tourId: number;
}
