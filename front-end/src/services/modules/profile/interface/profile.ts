export interface Profile {
  id?: number;
  username: string;
  phone: string;
  email: string;
  name: string;
  fcmToken: string;
  nickName: string;
  avatar: string;
  role: string;
  sex: string;
  dateOfBirth: string;
  address: string;
  status: string
}

export interface UpdateProfile {
  id: number,
  name: string,
  phone: string,
  nickName?: string,
  avatar?: string,
  role?: string,
  status?: string,
  sex?: string,
  dateOfBirth: string,
  address: string
}

export interface SetPassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}