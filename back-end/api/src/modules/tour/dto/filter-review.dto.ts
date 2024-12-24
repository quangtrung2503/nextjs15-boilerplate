import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { FilterOptions } from 'src/helpers/common/filterOption.dto';

export class FilterReviewDto extends OmitType(FilterOptions, ['from', 'to']) {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of ratings',
    required: false,
    type: [Number]
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(id => Number(id.trim()));
    }
    return value?.map(Number);
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
    ratings?: number[];
}