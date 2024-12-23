import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from 'src/helpers/constants/enum.constant';

export const UpdateStatusBookingDtoKeys: (keyof UpdateStatusBookingDto)[] = ['status']

export class UpdateStatusBookingDto {
  @ApiProperty({
    example: BookingStatus.PENDING,
    description: 'Booking status',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
    required: true,
  })
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  readonly status: BookingStatus;
}
