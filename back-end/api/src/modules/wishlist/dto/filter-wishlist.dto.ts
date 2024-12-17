import { OmitType } from '@nestjs/swagger';
import { FilterOptions } from 'src/helpers/common/filterOption.dto';

export class FilterWishlistDto extends OmitType(FilterOptions, ['from', 'to']) {}
