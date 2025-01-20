import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RequestRefundStatus } from 'src/helpers/constants/enum.constant';
import { CreateRequestRefundDto } from './create-request-refund.dto';

export const UpdateRequestRefundDtoKeys: (keyof UpdateRequestRefundDto)[] = ['status', 'imageProof', 'note']

export class UpdateRequestRefundDto {
  @ApiProperty({
    example: RequestRefundStatus.APPROVED,
    description: 'Request refund status',
    enum: RequestRefundStatus,
    default: RequestRefundStatus.APPROVED,
    required: true,
  })
  @IsEnum(RequestRefundStatus)
  @IsNotEmpty()
  readonly status: RequestRefundStatus;

  @ApiProperty({
    example: 'https://example.com/image1.jpg',
    description: 'Image proof',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly imageProof?: string;

  @ApiProperty({
    example: 'Note ...........',
    description: 'Note description',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly note?: string;
}

export class UpdateRequestRefundCustomerDto extends PartialType(CreateRequestRefundDto) {}
