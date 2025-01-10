import { statusColors } from "@/utils/utils";

export interface Tour {
  id?: number;
  name: string;
  slug?: string;
  price: number;
  transport: string;
  package: string;
  numberOfPeople: number;
  numberOfHours: number;
  startDate: string;
  endDate: string;
  isFeature?: boolean;
  isActive?: boolean;
  description: string;
  activity: string;
  included: string;
  notIncluded: string;
  safety: string;
  language: string;
  guideMeetingAddress?: string;
  cityId: number;
  themeId: number;
  destinationIds?: number[];
  createdAt?: string;
  updatedAt?: string;
  City?: City;
  Theme?: Theme;
  TourDestination?: TourDestination[];
  TourImage?: TourImage[];
  averageRating?: number;
  images: string[];
  totalReviews?: number;
}

export interface HistoryBookingTour {
  id: number;
  orderId: string;
  createdAt: string;
  status: keyof typeof statusColors;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  numberOfAdults: number;
  numberOfChildren: number;
  paymentMethod: string;
  pricePerTour: number;
  totalPrice: number;
  Tour: Tour;
};

export interface City {
  id: number;
  name: string;
  image: string;
  description: string;
  isActive: boolean;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Theme {
  id: number;
  name: string;
  isDisplay: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Destination {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TourDestination {
  id: number;
  tourId: number;
  destinationId: number;
  createdAt: string;
  updatedAt: string;
  Destination: Destination;
}

export interface TourImage {
  id: number;
  tourId: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  tour: Tour;
  listTourInToday: Tour[];
  listTourSameCity: Tour[];
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface CustomerReview {
  id: number;
  userId: number;
  tourId: number;
  ratingGuide: number;
  ratingTransportation: number;
  ratingValueOfMoney: number;
  ratingSafety: number;
  rating: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string; 
  updatedAt: string; 
  User: User;
}

export interface Stats {
  avgRatingGuide: number;
  avgRatingTransportation: number;
  avgRatingValueOfMoney: number;
  avgRatingSafety: number;
  avgRating: number;
  totalReviews: number;
}

export interface ReviewData {
  items: CustomerReview[],
  totalItems: number;
  currentPage: number;
  totalPage: number;
  perPage: number;
  stats: Stats;
}
