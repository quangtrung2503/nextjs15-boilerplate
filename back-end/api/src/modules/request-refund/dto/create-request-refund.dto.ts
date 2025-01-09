import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BookingCancellationReason } from 'src/helpers/constants/enum.constant';

export const CreateRequestRefundDtoKeys: (keyof CreateRequestRefundDto)[] = ['reason', 'imageQRCode', 'accountHolderName', 'accountNumber', 'bankName']

export class CreateRequestRefundDto {
  @ApiProperty({
    example: BookingCancellationReason.CHANGE_OF_PLANS,
    description: 'Refund cancel',
    required: true,
    enum: BookingCancellationReason
  })
  @IsNotEmpty()
  @IsEnum(BookingCancellationReason)
  readonly reason: BookingCancellationReason;

  @ApiProperty({
    example: 'https://image.png',
    description: 'Image QRCode of customer',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly imageQRCode: string;

  @ApiProperty({
    example: 'VU VAN A',
    description: 'Account holder name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly accountHolderName: string;

  @ApiProperty({
    example: '000121299923239',
    description: 'Account number',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly accountNumber: string;

  @ApiProperty({
    example: 'TPBANK',
    description: 'Bank name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly bankName: string;
}
