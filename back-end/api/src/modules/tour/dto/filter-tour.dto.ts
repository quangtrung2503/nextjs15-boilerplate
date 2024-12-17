import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { FilterOptions } from 'src/helpers/common/filterOption.dto';
import { Duration } from 'src/helpers/constants/enum.constant';

export class FilterTourDto extends FilterOptions {
  @ApiProperty({
    example: true,
    required: false
  })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
    isFeature?: boolean;

  @ApiProperty({
    example: 5,
    required: false
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
    cityId?: number;

  @ApiProperty({
    example: 5,
    required: false
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
    themeId?: number;

  @ApiProperty({
    example: Duration.THREE_TO_FIVE_HOURS,
    description: 'Duration of tour',
    enum: Duration,
    default: Duration.THREE_TO_FIVE_HOURS,
    required: false,
  })
  @IsEnum(Duration)
  @IsOptional()
    duration?: Duration;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of destination IDs',
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
    destinationIds?: number[];
}
