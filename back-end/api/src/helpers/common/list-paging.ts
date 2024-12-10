import { SortOrder } from 'src/helpers/constants/enum.constant';

export interface IPropsPaging {
  where?: any;
  orderBy?: any;
  include?: any;
  select?: any;
}

export interface IFuncPaging {
  items: any[];
  totalItems?: number;
  currentPage?: number;
  totalPage?: number;
  perPage?: number;
}

export const funcListPaging = async (
  service: any,
  options: IPropsPaging,
  page?: number,
  perPage?: number,
): Promise<IFuncPaging> => {
  const { include, where, orderBy, select } = options;
  // setup filter
  let allFilter;
  let _orderBy = orderBy
  const limit = isNaN(perPage) ? 10 : perPage;
  const offset = isNaN(page) ? 1 : page;

  allFilter = { where }; // filter default

  if (!orderBy || 'undefined' in orderBy || 'null' in orderBy) {
    _orderBy = { 'createdAt': SortOrder.DESC }
  }

  if (orderBy) allFilter = { ...allFilter, orderBy: _orderBy };
  if (include) allFilter = { ...allFilter, include };
  if (select) allFilter = { ...allFilter, select };

  if (perPage && page) {
    // filter for paging
    allFilter = { ...allFilter, take: limit };
    allFilter = { ...allFilter, skip: (offset - 1) * limit };
  }

  // query
  const items: Array<any> = service?.findAll ? await service.findAll(allFilter) : await service.findMany(allFilter);
  const totalItems: number = await service.count({ where: where });
  const totalPage: number = Math.floor((totalItems + (limit - 1)) / limit) ?? 1;
  return {
    items,
    totalItems,
    currentPage: page,
    totalPage,
    perPage: limit,
  };
};
