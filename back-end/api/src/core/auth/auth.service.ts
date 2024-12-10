import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from 'prisma/prisma.service';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { BackendConfigService } from '../services/backend-config.service';
import { FirebaseService, TopicNoti } from '../services/firebase.service';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { IUserJwt } from './strategies/jwt.strategy';
import { UserService } from 'src/modules/user/user.service';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nCustomService,
    private readonly jwtService: JwtService,
    private readonly configService: BackendConfigService,
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
  ) { }

  async hashPassword(password: string): Promise<string> {
    return await hash(
      password,
      parseInt(this.configService.getEnv('AUTH_SALT_ROUND')),
    );
  }

  async comparePassword(inputPassword: string, hashPassword: string) {
    return await compare(inputPassword, hashPassword);
  }

  async updatePassword(userId: number, password: string) {
    return this.userService.update(userId, { password: await this.hashPassword(password) })
  }

  async generateAccessToken(payload: IJwtPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getEnv('AUTH_JWT_ACCESS_EXPIRES_IN'),
      secret: this.configService.getEnv('AUTH_JWT_ACCESS_SECRET'),
    });
  }

  async generateRefreshToken(
    payload: IJwtPayload,
    isRemember?: boolean,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: isRemember
        ? this.configService.getEnv(
          'AUTH_ADMIN_JWT_REFRESH_REMEMBER_EXPIRES_IN',
        )
        : this.configService.getEnv('AUTH_ADMIN_JWT_REFRESH_EXPIRES_IN'),
      secret: this.configService.getEnv('AUTH_JWT_REFRESH_SECRET'),
    });
  }

  async decodeJWT(token: string): Promise<IJwtPayload> {
    const decode = await this.jwtService.decode(token);
    const jwt: IJwtPayload = {
      sub: decode?.sub,
      exp: decode?.exp,
      iat: decode?.iat,
      username: decode?.username,
    }
    return jwt
  }

  async logout(user: IUserJwt) {
    const userRequest = await this.userService.findOne({ where: { id: user.data.id } });
    if (!userRequest) throw new BaseException(Errors.UNAUTHORIZED(this.i18n.t('common-message.auth.logout.user_not_found')));
    await this.firebaseService.unsubscribeFromTopic([userRequest.fcmToken], TopicNoti.TopicForAllUser)
    await this.userService.update(userRequest.id, { lastAccessToken: null, fcmToken: null });
    return true;
  }
}
