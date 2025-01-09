
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
  BUSINESS_TOUR = 'Business Tour',
}

export enum Duration {
  ZERO_TO_THREE_HOURS = '0-3 hours',
  THREE_TO_FIVE_HOURS = '3-5 hours',
  FIVE_TO_SEVEN_HOURS = '5-7 hours',
  FULL_DAY = 'Full day (7+ hours)',
  MULTI_DAY = 'Multi-day'
}

export enum TourSortField {
  CREATED_AT = 'createdAt',
  PRICE = 'price',
  POPULARITY = 'popularity'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  VNPAY = 'VNPAY'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED'
}

export enum BookingCancellationReason {
  CHANGE_OF_PLANS = 'Change of Plans', // Khách thay đổi kế hoạch cá nhân
  HEALTH_ISSUES = 'Health Issues', // Gặp vấn đề về sức khỏe
  FAMILY_EMERGENCY = 'Family Emergency', // Khẩn cấp gia đình
  FINANCIAL_ISSUES = 'Financial Issues', // Vấn đề tài chính
  SCHEDULE_CONFLICT = 'Schedule Conflict', // Trùng lịch trình
  TRAVEL_RESTRICTIONS = 'Travel Restrictions', // Hạn chế đi lại
  WEATHER_CONCERNS = 'Weather Concerns', // Lo ngại về thời tiết
  FOUND_BETTER_OPTION = 'Found a Better Option', // Tìm được lựa chọn khác phù hợp hơn
  PERSONAL_REASONS = 'Personal Reasons', // Lý do cá nhân
  OTHER = 'Other', // Lý do khác không cụ thể
}

export enum RequestRefundStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED ='REJECTED'
}

export enum Rating {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5
}