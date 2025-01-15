import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import moment from 'moment';
import { FilterOptions } from 'src/helpers/common/filterOption.dto';

export class FilterBookingMonthlyStats {
  @ApiProperty({
    example: '2025',
    required: false,
    description: 'Statistics by year',
  })
  @IsOptional()
  @Transform(({ value }) => moment(value ?? null)?.isValid() ? moment(value).toDate() : value)
  @IsDate()
  readonly year?: Date;

}

export class FilterNewBookingStats extends (OmitType(FilterOptions, ['from', 'to', 'sortField', 'sortOrder', 'textSearch'])) {
  @ApiProperty({
    example: '2025-01',
    required: false,
    description: 'Statistics by year-month',
  })
  @IsOptional()
  @Transform(({ value }) => moment(value ?? null)?.isValid() ? moment(value).toDate() : value)
  @IsDate()
  readonly dateApplied?: Date;
}