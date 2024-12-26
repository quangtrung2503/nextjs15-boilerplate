import { OmitType } from '@nestjs/swagger';
import { FilterOptions } from 'src/helpers/common/filterOption.dto';

export class FilterCityDto extends FilterOptions {}

export class FilterCityCustomerDto extends OmitType(FilterOptions, ['textSearch', 'from', 'to', 'sortField', 'sortOrder']) {}
