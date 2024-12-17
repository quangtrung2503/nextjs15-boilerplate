import { TransportOfTour } from "@/helpers/common";

export interface Tour{
  id?: number;
  name: string
  price: number,
  description: string,
  transport: TransportOfTour,
  package: string,
  duration: string,
  numberOfHours: number,
  numberOfPeople: number,
  startDate: Date,
  endDate: Date,
  isFeature: boolean,
  cancellationPolicy: string,
  healthPrecautions: string,
  ticketType: string,
  confirmation: string,
  guideLanguage: string,
  cityId: number,
  themeId: number,
  destinationId: number,
  images: string[]
}