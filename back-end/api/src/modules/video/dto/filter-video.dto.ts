import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { FilterOptions } from 'src/helpers/common/filterOption.dto';

export class FilterVideoDto extends OmitType(FilterOptions, ['from', 'to']) {
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
    isDisplay?: boolean;
}