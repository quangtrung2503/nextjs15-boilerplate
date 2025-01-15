import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import moment from 'moment';
import { BookingStatus, FORMAT_DATE, PaymentMethod } from 'src/helpers/constants/enum.constant';

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
    example: '2025-01-25',
    description: 'The start date of booking',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value)
      return moment(value ?? null)?.isValid() ? moment(moment(value).format(FORMAT_DATE.DATE)).toDate() : value
  })
  @IsDate()
  readonly startDate: Date;

  @ApiProperty({
    example: '2025-01-27',
    description: 'The end date of booking',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value)
      return moment(value ?? null)?.isValid() ? moment(moment(value).format(FORMAT_DATE.DATE)).toDate() : value
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
    example: 100000,
    description: 'Total price',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly totalPrice: number;

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

  @ApiProperty({
    example: PaymentMethod.VNPAY,
    description: 'Payment Method',
    enum: PaymentMethod,
    default: PaymentMethod.VNPAY,
    required: true,
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  readonly paymentMethod: PaymentMethod;
}
