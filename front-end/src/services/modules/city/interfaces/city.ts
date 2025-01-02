import { Tour } from "../../tour/interfaces/tour";

export interface City {
  id?: number;
  name: string;
  image?: string;
  description: string;
  tagIds: number[];
  Tag?: Tag[];
  isActive?: boolean;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface CityUpdate {
  id: number;
  name?: string;
  image?: string;
  description?: string;
}
export interface Tag {
  id?: number;
  name?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface CityDetail {
  id?: number;
  name: string;
  image?: string;
  description: string;
  isActive?: boolean;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  Tour: Tour[];
  Tag: Tag[];
}
