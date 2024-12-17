import { OmitType } from '@nestjs/swagger';
import { FilterOptions } from 'src/helpers/common/filterOption.dto';

export class FilterTourImageDto extends OmitType(FilterOptions, ['from', 'to', 'textSearch']) {}
