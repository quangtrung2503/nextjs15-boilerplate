// import { IMAGE_REGEX, WarehousingStatus } from 'constants/common';
import apiUrls from '@/constants/apiUrls';
import dayjs from 'dayjs';
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

export const isDaysJSObject = (date: Date) => {
  return date instanceof dayjs;
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

export const convertToQueryDate = (value: dayjs.Dayjs | Date | string | undefined) => {
  if (value) {
    const formatYearMonthDay = dayjs(value).format('YYYY-MM-DD');
    return formatYearMonthDay;
  }
  return '';
};

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

export const convertOrderData = (values: FormikValues) => {
  const unitArr = !isEmpty(values?.units)
    ? values?.units?.map((el: any) => {
        const unit = el?.product?.UnitProductUnit.find(
          (data: any) => (data?.id).toString() === (el?.unit_id).toString()
        );
        return {
          productId: el?.product?.id,
          quantity: Number(el?.quantity),
          price: el?.cost,
          unitProductUnitId: unit?.id,
          manufacturingLotId: el?.number,
          note: formatStringDataIsEmpty(el?.note),
        };
      })
    : [];

  const comboArr = !isEmpty(values?.combos) ? values?.combos?.map((el: any) => el.id) : [];
  const sortedArray = comboArr.sort((a: number, b: number) => a - b);
  const resultCombo = sortedArray.join(', ');

  const presArr = !isEmpty(values?.prescriptions)
    ? values?.prescriptions?.map((el: any) => {
        const unitPresoArr = !isEmpty(el?.units)
          ? el?.units.map((unit: any) => {
              const unitProductPres = unit?.product?.UnitProductUnit.find(
                (data: any) => (data?.id).toString() === (unit?.unit_id).toString()
              );
              return {
                productId: unit?.product?.id,
                quantity: Number(unit?.quantity),
                price: unit?.cost,
                unitProductUnitId: unitProductPres?.id,
                manufacturingLotId: unit?.number,
                note: formatStringDataIsEmpty(unit?.note),
              };
            })
          : [];

        return {
          customerCode: formatStringDataIsEmpty(el?.patient_code),
          height: Number(el?.height),
          weight: Number(el?.weight),
          yearBirth: Number(el?.year_old),
          medicalInsurance: formatStringDataIsEmpty(el?.bhyt),
          doctorName: formatStringDataIsEmpty(el?.doctor),
          customerAddress: formatStringDataIsEmpty(el?.patient_address),
          cid: formatStringDataIsEmpty(el?.id_card),
          tutor: formatStringDataIsEmpty(el?.caregiver),
          medicalExaminationFacility: formatStringDataIsEmpty(el?.clinic),
          medicalExaminationFacilityAddress: formatStringDataIsEmpty(el?.address),
          doctorNote: formatStringDataIsEmpty(el?.doctor_diagnosis),
          prescriptionProduct: unitPresoArr,
          customerName: formatStringDataIsEmpty(el?.name_patient),
          prescriptionDate: formatStringDataIsEmpty(el?.created_at),
          prescriptionCode: formatStringDataIsEmpty(el?.code_invoice),
        };
      })
    : [];

  const discountType = values?.discount_type === 'percentage';
  const paymentType = values?.payment_method === 'cash' ? 'CASH' : 'BANKING';

  const checkDebt = values?.debt < 0 ? 0 : values?.debt;

  return {
    customerId: values?.customer_id?.value
      ? Number(values?.customer_id?.id || values?.customer_id?.value)
      : undefined,
    customerActualyPaid: Number(values?.pay_amount || 0),
    totalRaw: Number(values?.amount || 0),
    couponId: undefined,
    afterVatPercent: discountType ? Number(values?.discountAfterVAT || 0) : undefined,
    afterVatAmmount: discountType ? undefined : Number(values?.discountAfterVAT || 0),
    accumulatePoints: Number(values?.useAccumulatePoints || 0),
    totalNeedPay: Number(values?.customer_pay_amount || 0),
    debt: Number(checkDebt || 0),
    paymentType: paymentType,
    staffId: Number(values?.seller_id?.id | values?.seller_id?.value),
    note: formatStringDataIsEmpty(values?.note),
    isDraft: values?.submitType.toString() === 'temporarySave' ? true : false,
    invoiceDate: values?.receipt_date,
    combo: resultCombo === '' ? undefined : resultCombo,
    orderProduct: unitArr,
    prescription: presArr[0],
  };
};

export const convertBillPreviewData = (values: FormikValues) => {
  const unitArr = !isEmpty(values?.units)
    ? values?.units?.map((el: any) => {
        const manuLot = el?.manufacturingLot.find((data: any) => data?.id === el?.number);
        const unit = el?.product?.UnitProductUnit.find(
          (data: any) => (data?.id).toString() === (el?.unit_id).toString()
        );
        return {
          id: el?.id,
          barCode: el?.product?.barCode,
          name: el?.product?.name,
          unitId: unit?.unit?.id,
          unitName: unit?.unit?.name,
          quantity: el?.quantity,
          ManufacturingLot: manuLot,
          warehouseId: '',
          expiryDate: el?.expiry_date,
          cost: el?.money,
          vat: el?.vat || 0,
          note: el?.note || '',
        };
      })
    : [];

  const comboArr = !isEmpty(values?.combos)
    ? values?.combos?.map((el: any) => {
        const unitComboArr = !isEmpty(el?.productCombo)
          ? el?.productCombo.map((unit: any) => {
              const manuLot = unit?.ManufacturingLot;
              const unitt = unit?.product?.UnitProductUnit.find(
                (data: any) => (data?.unitId).toString() === (unit?.product?.unitId).toString()
              );

              return {
                id: unit?.id,
                barCode: unit?.product?.barCode,
                name: unit?.product?.name,
                unitId: unitt?.unit?.id,
                unitName: unitt?.unit?.name,
                quantity: unit?.quantity,
                ManufacturingLot: manuLot,
                warehouseId: '',
                expiryDate: moment(manuLot?.expiryDate, DateTimeFormat.APIFormat).format(
                  DateTimeFormat.FullDateDash
                ),
                cost: unitt?.price,
                vat: unit?.vat || 0,
                note: unit?.note || '',
                discount: unit?.discount || 0,
                discount_type: unit?.discount_type || 'amount',
                discount_rate: unit?.discount_rate || 0,
              };
            })
          : [];

        return {
          name: el?.name,
          note: el?.note,
          price: el?.totalPrice,
          quantity: values?.combos.length,
          totalPrice: el?.totalPrice,
          units: unitComboArr,
        };
      })
    : [];

  const presArr = !isEmpty(values?.prescriptions)
    ? values?.prescriptions?.map((el: any) => {
        const unitPresoArr = !isEmpty(el?.units)
          ? el?.units.map((unit: any) => {
              const manuLot = unit?.manufacturingLot.find((data: any) => data?.id === unit?.number);
              const unitt = unit?.product?.UnitProductUnit.find(
                (data: any) => (data?.id).toString() === (unit?.unit_id).toString()
              );
              return {
                id: unit?.id,
                barCode: unit?.product?.barCode,
                name: unit?.product?.name,
                unitId: unitt?.unit?.id,
                unitName: unitt?.unit?.name,
                quantity: unit?.quantity,
                ManufacturingLot: manuLot,
                warehouseId: '',
                expiryDate: moment(
                  manuLot?.expiryDate || new Date(),
                  DateTimeFormat.APIFormat
                ).format(DateTimeFormat.FullDateDash),
                cost: unitt?.price,
                vat: unit?.vat || 0,
                note: unit?.note || '',
                discount: unit?.discount || 0,
                discount_type: unit?.discount_type || 'amount',
                discount_rate: unit?.discount_rate || 0,
                exchange: unit?.exchange,
              };
            })
          : [];

        return {
          address: el?.address,
          bhyt: el?.bhyt,
          caregiver: el?.caregiver,
          clinic: el?.clinic,
          code_invoice: el?.code_invoice,
          created_at: moment(el?.created_at || new Date(), DateTimeFormat.APIFormat).format(
            DateTimeFormat.FullDateDash
          ),
          doctor: el?.doctor,
          doctor_diagnosis: el?.doctor_diagnosis,
          height: el?.height,
          id_card: el?.id_card,
          month_old: el?.month_old,
          name_patient: el?.name_patient,
          patient_address: el?.patient_address,
          patient_code: el?.patient_code,
          weight: el?.weight,
          year_old: el?.year_old,
          units: unitPresoArr,
        };
      })
    : [];

  return {
    amount: values?.amount,
    combos: comboArr,
    customer_id: values?.customer_id?.id,
    description: values?.description,
    discount: values?.discount || 0,
    discount_rate: values?.discount_rate || 0,
    discount_type: values?.discount_type || '',
    id: values?.id || '',
    method: values?.method || '',
    num_coin: values?.num_coin || 0,
    pay_amount: values?.pay_amount || 0,
    payment_method: values?.payment_method || '',
    prescriptions: presArr,
    receipt_date: moment(values?.receipt_date, DateTimeFormat.APIFormat).format(
      DateTimeFormat.FullDateDash
    ),
    seller_id: values?.seller_id?.id,
    status: values?.status || '',
    retails: unitArr,
    vat_amount: values?.vat_amount || 0,
  };
};

// export const convertCreateImportOrderData = (
//   values: FormikValues,
//   idReturned?: string | null,
//   isTemporary?: boolean
// ) => {
//   const unitArr = !isEmpty(values?.units)
//     ? values?.units?.map((el: any) => {
//         const parsedDate = moment(el?.expiry_date, 'DD/MM/YYYY');
//         return {
//           id: el?.id,
//           quantity: Number(el?.quantity),
//           productId: el?.productId,
//           discount: el?.discount,
//           discountRate: el?.discount_rate,
//           expiryDate: idReturned ? parsedDate.toISOString() : el?.expiry_date,
//           purchasePrice: Number(el?.cost),
//           unitProductUnitId: idReturned ? el?.unitProductUnit?.id : el?.unit_id,
//           manufacturingLot: el?.id ? undefined : el?.number?.label,
//           manufacturingLotId: el?.id ? el?.number : undefined,
//         };
//       })
//     : [];

//   const paymentType = values?.payment_method === 'cash' ? 'CASH' : 'BANKING';

//   const discountType = values?.discount_type === 'amount' ? 'CASH' : 'PERCENT';

//   return {
//     paymentType: paymentType || '',
//     totalAmount: Number(values?.amount),
//     discountType: discountType || '',
//     actualPaid: Number(values?.pay_amount) || 0,
//     discount: Number(values?.discountAfterVAT) || 0,
//     invoiceCode: values?.order_code || '',
//     invoiceDate: moment(values?.receipt_date, 'DD/MM/YYYY').toISOString(),
//     note: values?.note || '',
//     supplierId: !!idReturned ? values?.supplier_id : values?.supplier_id?.id,
//     type: values?.invoice_type || '',
//     StockProductStock: unitArr,
//     status:
//       values?.submitType.toString() === 'temporarySave'
//         ? WarehousingStatus.DRAFT
//         : WarehousingStatus.SUCCESS,
//   };
// };

export const convertOrderDataReturned = (values: FormikValues) => {
  const unitArr = !isEmpty(values?.units)
    ? values?.units?.map((el: any) => {
        return {
          productId: el?.id,
          quantity: Number(el?.quantity),
        };
      })
    : [];
  const paymentType = values?.payment_method === 'cash' ? 'CASH' : 'BANKING';

  return {
    customerActualyPaid: values?.pay_amount,
    totalRaw: values?.amount,
    afterVatAmmount: values?.discountAfterVAT,
    accumulatePoints: values?.useAccumulatePoints,
    totalNeedPay: values?.customer_pay_amount,
    debt: Number(values?.debt),
    staffId: values?.Seller?.id,
    isDraft: false,
    invoiceDate: moment(values?.receipt_date).toISOString(),
    paymentType: paymentType,
    refund: unitArr,
  };
};

export const convertOrderDataGDP = (values: FormikValues, GDP: FormikValues | undefined) => {
  const unitArr = !isEmpty(values?.units)
    ? values?.units?.map((el: any) => {
        const unit = el?.product?.UnitProductUnit.find(
          (data: any) => (data?.id).toString() === (el?.unit_id).toString()
        );
        return {
          productId: el?.product?.id,
          quantity: Number(el?.quantity),
          price: Number(el?.cost),
          unitProductUnitId: unit?.id,
          // manufacturingLotId: el?.number,
          entityManagerId: el?.entityManagerId,
          note: formatStringDataIsEmpty(el?.note),
        };
      })
    : [];

  const discountType = values?.discount_type === 'percentage';
  const paymentType = values?.payment_method === 'cash' ? 'CASH' : 'BANKING';

  return {
    dayExpect: formatStringDataIsEmpty(values?.order_date),
    paymentType: paymentType,
    totalPriceRaw: Number(values?.amount || 0),
    afterVatPercent: discountType ? Number(values?.discountAfterVAT || 0) : undefined,
    afterVatAmmount: discountType ? undefined : Number(values?.discountAfterVAT || 0),
    actualyPaid: Number(values?.pay_amount || 0),
    debt: Number(values?.debt || 0),
    note: formatStringDataIsEmpty(values?.note),
    isDraft: values?.submitType.toString() === 'temporarySave' ? true : false,
    staffId: Number(values?.seller_id?.id | values?.seller_id?.value),
    GDPId: Number(GDP?.id | GDP?.value),
    product: unitArr,
  };
};

export const convertOrderDataGDPApprove = (values: FormikValues) => {
  const unitArr = !isEmpty(values?.units)
    ? values?.units?.map((el: any) => {
        const unit = el?.product?.UnitProductUnit.find(
          (data: any) => (data?.id).toString() === (el?.unit_id).toString()
        );
        return {
          id: el?.orderGDPId,
          productId: el?.product?.id,
          quantity: Number(el?.quantity),
          price: Number(el?.cost),
          unitProductUnitId: unit?.id,
          manufacturingLotId: el?.number,
          entityManagerId: el?.entityManagerId,
          note: formatStringDataIsEmpty(el?.note),
        };
      })
    : [];

  return {
    product: unitArr,
  };
};
