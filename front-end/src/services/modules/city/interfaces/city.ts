export interface City{
  id?: number;
  name: string;
  image?: string;
  description: string;
}
export interface CityUpdate{
  id: number;
  name?: string;
  image?: string;
  description?: string;
}