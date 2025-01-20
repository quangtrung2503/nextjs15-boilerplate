import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export const UpdateBookingDtoKeys: (keyof UpdateBookingDto)[] = ['note'];

export class UpdateBookingDto  {
  @ApiProperty({
    example: 'Note ........',
    description: 'Note ........',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly note?: string;
}