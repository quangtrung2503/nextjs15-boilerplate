
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