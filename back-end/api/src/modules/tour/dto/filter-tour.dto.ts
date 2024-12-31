import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { FilterOptions } from 'src/helpers/common/filterOption.dto';
import { Duration, TourSortField } from 'src/helpers/constants/enum.constant';

export class FilterTourDto extends FilterOptions {
  @ApiProperty({
    enum: TourSortField,
    default: TourSortField.PRICE,
    required: false
  })
  @IsEnum(TourSortField)
  @IsOptional()
    sortField?: TourSortField;

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
    isFeatureDestination?: boolean;

  @ApiProperty({
    example: 5,
    required: false
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
    cityId?: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of theme IDs',
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
    themeIds?: number[];

  @ApiProperty({
    example: [Duration.FULL_DAY, Duration.FIVE_TO_SEVEN_HOURS],
    description: 'Array of duration',
    required: false,
    enum: Duration,
    isArray: true,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((status) => status.trim() as Duration);
    }
    return value;
  })
  @IsArray()
  @IsEnum(Duration, { each: true })
  @IsOptional()
    durations?: Duration[];

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
