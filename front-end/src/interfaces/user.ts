export interface UserInfo {
  id: string;
  username: string;
  name: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  nickName?: string;
  company: string;
  address: string;
  role: string[];
  isFirstTimeLogin: boolean;
  avatar?: string;
  dateStartWork?: string,
  technology?: string,
  numbersAbsentOfYear?: number
}