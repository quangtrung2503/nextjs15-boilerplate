import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const CreateBankAccountDtoKeys: (keyof CreateBankAccountDto)[] = [
  'accountHolderName',
  'accountNumber',
  'imageQrCode',
  'isDisplay'
]

export class CreateBankAccountDto {
  @ApiProperty({
    example: 'VU VAN A',
    description: 'Bank Account Holder Name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly accountHolderName: string;

  @ApiProperty({
    example: '12345678901234567890',
    description: 'Bank Account Number',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly accountNumber: string;

  @ApiProperty({
    example: 'https://example.com/image1.jpg',
    description: 'Bank Account Image Qr Code',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly imageQrCode: string;

  @ApiProperty({
    example: true,
    description: 'Is Display Bank Account',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly isDisplay: boolean;
}
