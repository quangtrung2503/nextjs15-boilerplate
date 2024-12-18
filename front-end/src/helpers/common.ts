// import { IMAGE_REGEX, WarehousingStatus } from 'constants/common';
import apiUrls from '@/constants/apiUrls';

import { FormikValues } from 'formik';
// import { languages } from 'i18nOptions';
import Lodash, { get, identity, isEmpty, isNumber, isString, pickBy } from 'lodash';
import moment from 'moment';
import { usePathname } from 'next/navigation';
import queryString from 'query-string';

export const localStorageFunc: Storage | undefined =
  typeof window !== 'undefined' ? window.localStorage : undefined;

export const parseQueryString = () => {
  const search = queryString.parse(window.location.search);
  return { search };
};

export const fileToString = (file: string | File) => {
  if (isString(file)) {
    return file;
  }

  return URL.createObjectURL(file);
};

// export const removeLangFromPathname = (pathname?: string) => {
//   let nextPathname = pathname;
//   languages.forEach((lang) => {
//     nextPathname = nextPathname?.replace(`/${lang}`, '');
//   });

//   return nextPathname;
// };

// export const convertToFormSelect = (
//   list: any[],
//   fieldForLabel: string | number | undefined = undefined,
//   fieldForValue: string | number | undefined = undefined,
//   noneOption: boolean | undefined = false,
//   fieldAddLabel: string | number | undefined = undefined
// ) => {
//   if (fieldForValue && fieldForLabel && fieldAddLabel && typeof list === 'object' && list) {
//     const listReturn = [
//       ...list.reduce((arr: any, el: any) => {
//         return [
//           ...arr,
//           {
//             ...el,
//             label: `${get(el, fieldForLabel)} - ${get(el, fieldAddLabel)}` ?? 'None',
//             value: get(el, fieldForValue) ?? '',
//           },
//         ];
//       }, []),
//     ];

//     if (noneOption) {
//       return [{ label: 'None', value: '' }, ...listReturn];
//     }
//     return listReturn;
//   }
//   if (!fieldForLabel || !fieldForValue) {
//     return [
//       ...list.reduce((arr: any, el: any) => {
//         return [...arr, { label: el, value: el }];
//       }, []),
//     ];
//   }
//   if (typeof list === 'object' && list) {
//     const listReturn = [
//       ...list.reduce((arr: any, el: any) => {
//         return [
//           ...arr,
//           {
//             ...el,
//             label: get(el, fieldForLabel) ?? 'None',
//             value: get(el, fieldForValue) ?? '',
//           },
//         ];
//       }, []),
//     ];

//     if (noneOption) {
//       return [{ label: 'None', value: '' }, ...listReturn];
//     }
//     return listReturn;
//   }
//   return [{ label: 'None', value: '' }, ...list];
// };

export const formatCurrency = (value: number) => {
  return value.toLocaleString().replaceAll(',', '.');
};

export const convertCurrencyToString = (currency: string) => {
  return currency.toString().replaceAll('.', '');
};

export const convertToDate = (value: Date | string) => {
  const formatDayMonthYear = moment(value).format('DD/MM/YYYY');

  return formatDayMonthYear;
};

export const isDevelopment = () => {
  return window.location.origin.includes('localhost');
};

export const isDateObject = (date: Date | moment.Moment) => {
  return date instanceof Date;
};

export const isMomentObject = (date: Date | moment.Moment) => {
  return date instanceof moment;
};

export const localeNumber = (
  number?: number,
  options?: {
    locales: Intl.LocalesArgument;
    options: Intl.NumberFormatOptions;
  }
) => {
  if (isNumber(number)) {
    return number.toLocaleString(options?.locales || 'vi-VI', options?.options);
  }

  return 'N/A';
};

export const snakeCaseToWords = (input: string) => {
  return input
    ?.split('_')
    ?.map((word) => word.toLowerCase())
    ?.join(' ');
};

// export const convertToQueryDate = (value: dayjs.Dayjs | Date | string | undefined) => {
//   if (value) {
//     const formatYearMonthDay = dayjs(value).format('YYYY-MM-DD');
//     return formatYearMonthDay;
//   }
//   return '';
// };

export const convertStringToDateTime = (value: string) => {
  // Value Required HH:mm
  const time = value;
  const currentDate = new Date(); // Tạo đối tượng Date với ngày hiện tại

  // Lấy các thành phần ngày, tháng, năm từ ngày hiện tại
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

  // Tạo đối tượng Date với ngày hiện tại và thời gian chỉ định
  const dateTime = new Date(
    year,
    month,
    day,
    parseInt(time.split(':')[0]),
    parseInt(time.split(':')[1])
  );
  return dateTime;
};

export const removeAMPM = (timeString: string) => {
  return timeString.replace(/AM|PM/gi, '');
};


export const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(price);
};

export const formatPriceCurrency = (price: number, currencyType: string) => {
  let currency = 'USD';
  let unit = '';

  switch (currencyType) {
    case 'USD':
      currency = 'USD';
      unit = '$';
      break;
    case 'peso':
      currency = 'PHP';
      unit = '₱';
      break;
    case 'vnđ':
      currency = 'VND';
      unit = '₫';
      break;
    default:
      currency = 'USD';
      unit = '$';
      break;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  let formattedPrice = formatter.format(price);

  // Nếu loại tiền tệ là VND, loại bỏ ký hiệu tiền tệ và thay thế nó bằng đơn vị tiền tệ
  if (currencyType === 'vnđ') {
    formattedPrice = formattedPrice.replace(/^([^0-9]*)([0-9,]+)/, '$2');
    // Thêm ký hiệu tiền tệ vào cuối chuỗi kết quả
    formattedPrice += unit;
  }

  return formattedPrice;
};

// export const isImage = (url: string) => {
//   return IMAGE_REGEX.test(url);
// };

export enum DateTimeFormat {
  FullYearDash = 'YYYY-MM-DD',
  FullDateDash = 'DD/MM/YYYY',
  FullYearFormatDash = 'YYYY/MM/DD',
  FullMonthDash = 'MM/DD/YYYY',
  APIFormat = 'YYYY-MM-DD HH:mm:ss',
  FullDateShortMonth = 'MMM DD, YYY',
  DateMonth = 'DD/MM',
  DateMonthDash = 'MM-YYYY',
  MonthYear = 'MM, YYYY',
  Year = 'YYYY',
  Month = 'MM',

  FullDateTime = 'DD/MM/YYYY hh:mm:ss',
  DateTimeAmPm = 'DD/MM/YYYY hh A',
  DateTime24h = 'DD/MM/YYYY HH:mm',
  Time = 'hh:mm:ss',
  FullDate = 'DD MMM YYYY',
  TimeHourMinPM = 'HH:mm A',
  HourMinutes = 'HH:mm',

  TimeFullDateDash = 'HH:mm - DD/MM/YYYY',
  TimeFullDateDashReverse = 'HH:mm - YYYY/MM/DD',
  DateTime24hReverse = 'HH:mm DD/MM/YYYY',
  Time24hDateFullReverse = 'HH:mm:ss YYYY/MM/DD',
  AmPmDateMonthYear = 'HH:mm A - DD/MM/YYYY',

  NameMonthYear = 'MMMM YYYY',
  DateMonthYear = 'DD-MM-YYYY',

  FullDateDashLowercase = 'dd/MM/yyyy',
  DateTime24hFull = 'HH:mm:ss DD/MM/YYYY',
}

export const checkPathname = (itemCheck: string) => {
  const pathname = usePathname();
  const arrayItemInPathname = pathname.split('/');
  const checkInclude = arrayItemInPathname.includes(itemCheck);
  return checkInclude;
};

export const convertParamFilter = (parseRequest: any, currentFilter: any) => {
  return Lodash(parseRequest(currentFilter))
    .omitBy(Lodash.isUndefined)
    .omitBy(Lodash.isNull)
    .value();
};

export const snakeToCamel = (str: string) => {
  return str.replace(/_([a-z])/g, function (match, letter) {
    return letter.toUpperCase();
  });
};

export const convertKeys = <T>(obj: { [key: string]: any }) => {
  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = snakeToCamel(key);
      newObj[newKey] = obj[key];
    }
  }
  return newObj as T;
};

export const addURLImage = (url: string) => {
  return `${apiUrls.IMG_URL}/${url}`;
};

export function parseQueryParams(url: string) {
  let params = new URLSearchParams(new URL(url).search);
  let result: { [x: string]: string } = {};
  //@ts-ignore
  for (let [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

export function addQueryParams(url: string, params: any) {
  let searchParams = new URLSearchParams();
  for (const key in pickBy(params, identity)) {
    if (params.hasOwnProperty(key)) {
      searchParams.append(key, params[key]);
    }
  }
  return `${url}?${searchParams.toString()}`;
}

export const formatCurrencyVND = (amount: number) => {
  return `${new Intl.NumberFormat('en-US', { style: 'decimal', currency: 'VND' }).format(
    amount
  )} ₫`;
};

export function generateRandomString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const removeVietnameseTones = (str: string) => {
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
  return str;
};

export function formatNumber(number?: number, thousandSeparator = ',', decimalSeparator = '') {
  if (!number) {
    return 0;
  }
  if (typeof number !== 'number') {
    return '';
  }

  const [integerPart, decimalPart] = number.toFixed(2).split('.');
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

  return `${formattedIntegerPart}${decimalSeparator}`;
}

export function parseFormattedNumber(formattedNumber: string | number) {
  if (!formattedNumber) {
    return 0;
  }
  if (typeof formattedNumber === 'number') {
    return formattedNumber;
  }
  // Remove thousand separators and convert to number
  const numberString = formattedNumber.replace(/,/g, '');
  return Number(parseFloat(numberString));
}

export const formatStringDataIsEmpty = (value: string) => {
  return value === '' ? undefined : value;
};


export const getOptionEnum = <T extends Record<string, string>>(data: T) => {
  return Object.values(data).map((item) => ({
    key: item,
    label: item,
    value: item,
  }));
};

export enum TransportOfTour {
  TransportFacility= "Transport Facility",
  PrivateCar= "Private Car",
  SharedBus= "Shared Bus" 
}
export enum Role{
  ADMIN ="ADMIN",
  STAFF ="STAFF",
  CUSTOMER ="CUSTOMER",
}

export const TINY_API = 'z05d7wzwwza58npx1ncwvo79r6rnxq5zivx4gqk5sz4zsr9z';

export enum FORMAT_DATE {
  DATE_TIME = 'YYYY-MM-DD HH:mm:ss',
  DATE = 'YYYY-MM-DD',
  TIME = 'HH:mm:ss'
}
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
export enum Platform {
  WEB = 'WEB',
  APP = 'APP',
}
export enum LoginMethod {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
}
export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  PDF = 'PDF',
}
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  DELETED = 'DELETED'
}
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}
export enum Language {
  VI = 'VI',
  EN = 'EN',
}
export enum AppType {
  WEB_HOOK = 'WEB_HOOK',
  REPORT = 'REPORT',
}
export enum Transport {
  TRANSPORT_FACILITY = 'Transport Facility',
  PRIVATE_CAR = 'Private Car',
  SHARED_BUS = 'Shared Bus',
}
export enum Package {
  FAMILY_PLAN = 'Family Plan',
  COUPLE_PLAN = 'Couple Plan',
  SINGLE_PLAN = 'Single Plan',
}
export enum Duration {
  ZERO_TO_THREE_HOURS = '0-3 hours',
  THREE_TO_FIVE_HOURS = '3-5 hours',
  FIVE_TO_SEVEN_HOURS = '5-7 hours',
  FULL_DAY = 'Full day (7+ hours)',
  MULTI_DAY = 'Multi-day'
}