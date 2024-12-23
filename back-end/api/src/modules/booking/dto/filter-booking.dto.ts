import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { FilterOptions } from 'src/helpers/common/filterOption.dto';
import { BookingStatus } from 'src/helpers/constants/enum.constant';

export class FilterMyBooking extends OmitType(FilterOptions, ['from', 'to']) { }

export class FilterAllBooking extends OmitType(FilterOptions, ['from', 'to']) {
  @ApiProperty({
    example: ['Pending', 'Confirmed'],
    description: 'Array of booking statuses',
    required: false,
    enum: BookingStatus,
    isArray: true,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((status) => status.trim() as BookingStatus);
    }
    return value;
  })
  @IsArray()
  @IsEnum(BookingStatus, { each: true })
  @IsOptional()
    statuses?: BookingStatus[];
}