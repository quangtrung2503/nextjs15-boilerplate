import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { RequestRefundStatus } from 'src/helpers/constants/enum.constant';
import { CreateRequestRefundDto } from './create-request-refund.dto';

export const UpdateRequestRefundDtoKeys: (keyof UpdateRequestRefundDto)[] = ['status']

export class UpdateRequestRefundDto {
  @ApiProperty({
    example: RequestRefundStatus.APPROVED,
    description: 'Request refund status',
    enum: RequestRefundStatus,
    default: RequestRefundStatus.APPROVED,
    required: false,
  })
  @IsEnum(RequestRefundStatus)
  @IsOptional()
  readonly status?: RequestRefundStatus;
}

export class UpdateRequestRefundCustomerDto extends PartialType(CreateRequestRefundDto) {}
