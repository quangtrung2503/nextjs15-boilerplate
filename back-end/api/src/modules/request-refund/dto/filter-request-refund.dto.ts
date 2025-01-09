import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { FilterOptions } from 'src/helpers/common/filterOption.dto';
import { RequestRefundStatus } from 'src/helpers/constants/enum.constant';

export class FilterRequestRefund extends OmitType(FilterOptions, ['from', 'to']) {
  @ApiProperty({
    example: [RequestRefundStatus.PENDING],
    description: 'Array of request refund statuses',
    required: false,
    enum: RequestRefundStatus,
    isArray: true,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((status) => status.trim() as RequestRefundStatus);
    }
    return value;
  })
  @IsArray()
  @IsEnum(RequestRefundStatus, { each: true })
  @IsOptional()
    statuses?: RequestRefundStatus[];
}