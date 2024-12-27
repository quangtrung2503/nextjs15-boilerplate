import { User } from "../../user/interfaces/user.inteface";

export interface Post {
  id?: number;
  userCreatedId?: number;
  image: string;
  title: string;
  content: string;
  views?: number;
  slug?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  UserCreated?: User[];
}
