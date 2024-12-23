import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingCancellationReason } from 'src/helpers/constants/enum.constant';

export class CancelBookingDto {
  @ApiProperty({
    example: BookingCancellationReason.CHANGE_OF_PLANS,
    description: 'Cancel reason',
    enum: BookingCancellationReason,
    default: BookingCancellationReason.CHANGE_OF_PLANS,
    required: true,
  })
  @IsEnum(BookingCancellationReason)
  @IsNotEmpty()
  readonly cancelReason: BookingCancellationReason;
}
