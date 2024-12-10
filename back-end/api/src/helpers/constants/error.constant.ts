import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

interface BaseErrorFormat {
  errCode: string;
  statusCode: number;
  message: string;
}
export class BaseException extends HttpException {
  constructor(response: BaseErrorFormat, cause?: any) {
    super(response, response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
    this.stack = cause;
  }
}

// Define Errors
type keyErrors =
  | 'DEFAULT'
  | 'FORBIDDEN'
  | 'ITEM_NOT_FOUND'
  | 'ITEM_EXISTED'
  | 'OTP_NOT_FOUND'
  | 'CONFIRM_PASSWORD_NOT_MATCH'
  | 'WRONG_PASSWORD'
  | 'PAYMENT_ERROR'
  | 'BAD_REQUEST'
  | 'TERMS_AND_CONDITIONALS_ACCEPTED'
  | 'PAYMENT_ERROR'
  | 'FORBIDDEN_VERIFIED'
  | 'UNAUTHORIZED'

type IErrors = {
  [key in keyErrors]: (data?: any) => BaseErrorFormat;
};

export const Errors: IErrors = {
  DEFAULT: (data?: string) => ({
    errCode: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: data || (I18nContext.current().lang === 'en' ? 'Something went wrong' : 'Đã xảy ra lỗi'),
  }),
  ITEM_NOT_FOUND: (data: string) => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: I18nContext.current().lang === 'en' ? `${data} does not exists` : `${data} không tồn tại`,
  }),
  BAD_REQUEST: (data?: string) => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: data || (I18nContext.current().lang === 'en' ? 'BAD_REQUEST' : 'Yêu cầu không hợp lệ'),
  }),
  CONFIRM_PASSWORD_NOT_MATCH: () => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: I18nContext.current().lang === 'en' ? `Confirm password does not match` : 'Xác nhận mật khẩu không khớp',
  }),
  PAYMENT_ERROR: (message: string) => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: message,
  }),
  ITEM_EXISTED: (data: string) => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: I18nContext.current().lang === 'en' ? `${data} has existed` : `${data} đã tồn tại`,
  }),
  OTP_NOT_FOUND: () => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: I18nContext.current().lang === 'en' ? 'Otp is not found' : 'Không tìm thấy Otp',
  }),

  WRONG_PASSWORD: () => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: I18nContext.current().lang === 'en' ? 'Wrong password' : 'Sai mật khẩu',
  }),

  TERMS_AND_CONDITIONALS_ACCEPTED: () => ({
    errCode: HttpStatus.BAD_REQUEST.toString(),
    statusCode: HttpStatus.BAD_REQUEST,
    message: I18nContext.current().lang === 'en' ? 'Terms and conditionals are not agreed' : 'Các điều khoản và điều kiện không được đồng ý',
  }),

  FORBIDDEN: (message?: string) => ({
    errCode: HttpStatus.FORBIDDEN.toString(),
    statusCode: HttpStatus.FORBIDDEN,
    message: message || (I18nContext.current().lang === 'en' ? 'Forbidden resource' : 'Không có quyền'),
  }),

  FORBIDDEN_VERIFIED: () => ({
    errCode: HttpStatus.FORBIDDEN.toString(),
    statusCode: HttpStatus.FORBIDDEN,
    message: I18nContext.current().lang === 'en' ? 'Your account is not verified' : 'Tài khoản của bạn chưa được xác minh',
  }),

  UNAUTHORIZED: (message?: string) => ({
    errCode: HttpStatus.UNAUTHORIZED.toString(),
    statusCode: HttpStatus.UNAUTHORIZED,
    message: message ?? (I18nContext.current().lang === 'en' ? 'Invalid Access Token' : 'Token không hợp lệ'),
  }),
};
