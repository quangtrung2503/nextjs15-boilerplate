import { Tag } from "../../tag/interfaces/tag";

export interface City{
  id?: number;
  name: string;
  image?: string;
  description: string;
  tagIds: number[];
  Tag?: Tag[]
}
export interface CityUpdate{
  id: number;
  name?: string;
  image?: string;
  description?: string;
}