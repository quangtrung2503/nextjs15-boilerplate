import { Gender, Role, UserStatus } from "@/helpers/common";
import { Moment } from "moment";

export interface User{
  id?: number;
  username?: string;
  password?: string;
  email: string;
  name: string;
  phone: string;
  nickName?: string;
  avatar?: string;
  role?: Role;
  status: UserStatus;
  sex: Gender;
  dateOfBirth: string;
  address: string;
}
