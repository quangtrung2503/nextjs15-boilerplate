import { TransportOfTour } from "@/helpers/common";
export interface Tour {
  id?: number;
  name: string;
  price: number;
  transport: string;
  package: string;
  numberOfPeople: number;
  numberOfHours: number;
  startDate: string;
  endDate: string;
  isFeature?: boolean;
  description: string;
  activity: string;
  included: string;
  notIncluded: string;
  safety: string;
  language: string;
  cityId: number;
  themeId: number;
  destinationIds: number[];
  createdAt?: string;
  updatedAt?: string;
  City?: City;
  Theme?: Theme;
  TourDestination?: TourDestination[];
  TourImage?: TourImage[];
  averageRating?: number;
  images: string[];
  totalReviews?: number;
};
export interface City {
  id: number;
  name: string;
  image: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface Theme {
  id: number;
  name: string;
  isDisplay: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface Destination {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface TourDestination {
  id: number;
  tourId: number;
  destinationId: number;
  createdAt: string;
  updatedAt: string;
  Destination: Destination;
};

export interface TourImage {
  id: number;
  tourId: number;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export interface ApiResponse {
  tour: Tour;
  listTourInToday: Tour[];
  listTourSameCity: Tour[];
};