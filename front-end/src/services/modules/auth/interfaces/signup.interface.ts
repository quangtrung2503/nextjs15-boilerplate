import { AxiosResponse } from 'axios';

export interface SignUpResponse {
    id: number;
    username: string;
    password: string;
    phone: string;
    email: string;
    name: string;
    lastAccessToken: string;
    fcmToken: string;
    nickName: string;
    avatar: string;
    role: string;
    sex: string;
    dateOfBirth: string;
    address: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUser {
    id: number;
    username: string;
    isVerifyOtp: boolean;
    phone: string;
    email: string;
    status: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    storeID: number;
    roleID?: number;
    lastName?: string;
    firstName?: string;
    phoneCode?: string;
    cid?: string;
    avatar?: string;
    permissionId?: number;
}

export type SignUpRequest = {
    user?: string;
    password: string;
    confirmPassword?: string;
    phone?: string;
    name?: string;
};

export type ResponseLogin = AxiosResponse<SignUpRequest>;