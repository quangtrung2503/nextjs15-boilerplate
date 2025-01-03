import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import moment from 'moment';
import { BookingStatus, PaymentMethod } from 'src/helpers/constants/enum.constant';

export const CreateBookingDtoKeys: (keyof CreateBookingDto)[] = ['tourId', 'startDate', 'endDate', 'numberOfAdults', 'numberOfChildren', 'totalPrice', 'status', 'paymentMethod']

export class CreateBookingDto {
  @ApiProperty({
    example: 1,
    description: 'The id of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly tourId: number;

  @ApiProperty({
    example: '2024-09-30',
    description: 'The start date of booking',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value)
      return moment(value ?? null)?.isValid() ? moment(moment(value).format('YYYY-MM-DD')).toDate() : value
  })
  @IsDate()
  readonly startDate: Date;

  @ApiProperty({
    example: '2024-10-05',
    description: 'The end date of booking',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value)
      return moment(value ?? null)?.isValid() ? moment(moment(value).format('YYYY-MM-DD')).toDate() : value
  })
  @IsDate()
  readonly endDate: Date;

  @ApiProperty({
    example: 2,
    description: 'Number of adults',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly numberOfAdults: number;

  @ApiProperty({
    example: 1,
    description: 'Number of children',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly numberOfChildren: number;

  @ApiProperty({
    example: 120.50,
    description: 'Total price',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly totalPrice: number;

  @ApiProperty({
    example: BookingStatus.PAYMENT_PENDING,
    description: 'Booking status',
    enum: BookingStatus,
    default: BookingStatus.PAYMENT_PENDING,
    required: true,
  })
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  readonly status: BookingStatus;

  @ApiProperty({
    example: PaymentMethod.QR_CODE,
    description: 'Payment Method',
    enum: PaymentMethod,
    default: PaymentMethod.QR_CODE,
    required: true,
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  readonly paymentMethod: PaymentMethod;
}
