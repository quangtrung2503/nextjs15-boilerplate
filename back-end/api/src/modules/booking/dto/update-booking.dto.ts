import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';

export const UpdateBookingDtoKeys: (keyof UpdateBookingDto)[] = ['note', 'status'];

export class UpdateBookingDto extends PartialType(OmitType(CreateBookingDto, ['tourId', 'totalPrice', 'paymentMethod', 'startDate', 'endDate', 'numberOfAdults', 'numberOfChildren'])) {
  @ApiProperty({
    example: 'Note ........',
    description: 'Note ........',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly note?: string;
}