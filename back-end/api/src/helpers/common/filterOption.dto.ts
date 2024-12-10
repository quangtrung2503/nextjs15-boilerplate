import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum, IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import moment from 'moment';
import { SortOrder } from 'src/helpers/constants/enum.constant';

export class FilterOptions {
  @ApiProperty({
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
    page?: number;

  @ApiProperty({
    example: 10,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
    perPage?: number;

  @ApiProperty({
    example: 'createdAt',
    required: false,
  })
  @IsString()
  @IsOptional()
    sortField?: string;

  @ApiProperty({
    example: 'desc',
    required: false,
  })
  @IsEnum(SortOrder)
  @IsOptional()
    sortOrder?: SortOrder;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    switch (value?.trim()) {
      case '':
        return undefined
      default:
        return value;
    }
  })
  @IsString()
    textSearch?: string;

  @ApiProperty({
    required: false
  })
  @Transform(({ value }) => {
    if (value)
      return moment(value ?? null)?.isValid() ? moment(value).toDate() : value
  })
  @IsOptional()
  @IsDate()
    from?: Date;

  @ApiProperty({
    required: false
  })
  @Transform(({ value }) => {
    if (value)
      return moment(value ?? null)?.isValid() ? moment(value).toDate() : value
  })
  @IsOptional()
  @IsDate()
    to?: Date;
}
