import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';

export const UpdateBookingDtoKeys: (keyof UpdateBookingDto)[] = ['startDate', 'endDate', 'numberOfAdults', 'numberOfChildren', 'amountPaid', 'note', 'status'];

export class UpdateBookingDto extends PartialType(OmitType(CreateBookingDto, ['tourId', 'totalPrice', 'paymentMethod'])) {
  @ApiProperty({
    example: 120.50,
    description: 'Amount paid',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly amountPaid?: number;

  @ApiProperty({
    example: 'Note ........',
    description: 'Note ........',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly note?: string;
}

export const UploadPaymentProofDtoKeys: (keyof UploadPaymentProofDto)[] = ['paymentProof']

export class UploadPaymentProofDto {
  @ApiProperty({
    example: 'https://example.com/image1.jpg',
    description: 'Image proof of payment',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly paymentProof: string;
}