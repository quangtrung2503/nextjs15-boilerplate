import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { FilterOptions } from 'src/helpers/common/filterOption.dto';
import { Rating } from 'src/helpers/constants/enum.constant';

export class FilterReviewCustomerDto extends OmitType(FilterOptions, ['textSearch', 'from', 'to']) {
  @ApiProperty({
    enum: Rating,
    isArray: true,
    example: [Rating.FOUR, Rating.FIVE],
    description: 'Array of ratings (1-5)',
    required: false,
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(v => Number(v));
    }
    if (typeof value === 'string') {
      return value.split(',').map(v => Number(v.trim()));
    }
    return value;
  })
  @IsArray()
  @IsEnum(Rating, { each: true })
  @IsOptional()
    ratings?: Rating[];
}