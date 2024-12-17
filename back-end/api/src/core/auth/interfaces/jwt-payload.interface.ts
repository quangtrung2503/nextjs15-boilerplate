import { UserRole } from '@prisma/client';

export interface IJwtPayload {
    sub: string;  // this is id of user

    iat?: number;

    exp?: number;

    email?: string;

    role?: UserRole;
}
