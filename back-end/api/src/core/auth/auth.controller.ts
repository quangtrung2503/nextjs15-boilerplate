import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { UserService } from 'src/modules/user/user.service';
import { BackendConfigService } from '../services/backend-config.service';
import { FirebaseService, TopicNoti } from '../services/firebase.service';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { UserDecorator } from './decorators/user.decorator';
import { LoginDto } from './dtos/auth-login.dto';
import { ChangePassword } from './dtos/forgot-password.dto';
import { PushFcmTokenDto } from './dtos/push-fcm-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { IUserJwt } from './strategies/jwt.strategy';
import { _excludeObject } from 'src/helpers/functions/common.utils';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { UserSignupDto, UserSignupDtoKeys } from './dtos/user-signup.dto';
import { RegexConstant } from 'src/helpers/constants/regex.constant';

export interface LoginData {
  phone?: string;
  phoneCode?: string;
  email?: string;
  password: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly i18n: I18nCustomService,
    private readonly authService: AuthService,
    private readonly configService: BackendConfigService,
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
  ) { }

  @Post('sign-up')
  async signUp(@Body() body: UserSignupDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof UserSignupDto) => !UserSignupDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.auth.signup.wrong_parameter', { keyNotInDto })));

    if (!RegexConstant.PhoneReg.test(body.phone))
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.auth.signup.invalid_phone')));

    if (!RegexConstant.EmailReg.test(body.email))
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.auth.signup.invalid_email')));

    if (!RegexConstant.PasswordReg.test(body.password))
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.auth.signup.invalid_password')));

    const hashPassword = await this.authService.hashPassword(body.password)

    const data = await this.userService.create({
      data: {
        ...body,
        password: hashPassword,
      }
    })
    return data
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.userService.findOne({ 
      where: { username: body.userName },
    })
    if (!user) {
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.auth.login.user_not_found')));
    }
    const checkPassword = await this.authService.comparePassword(body.password, user.password)
    if (!checkPassword) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.auth.login.wrong_password')));
    }
    const accessToken = await this.authService.generateAccessToken({ sub: user.id.toString(), username: user.username, role: user.role });
    await this.userService.update(user.id, { lastAccessToken: accessToken })

    return {
      accessToken,
      tokenType: 'Bearer',
      user: _excludeObject(user, ['password', 'lastAccessToken'])
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.MEMBER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('change-password')
  async changePassword(@UserDecorator() user: IUserJwt, @Body() body: ChangePassword) {
    const userRequest = await this.userService.findOne({ where: { username: user.data.username } })
    if (!userRequest) {
      throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.auth.changePassword.user_not_found')));
    }

    const checkPassword = await this.authService.comparePassword(body.currentPassword, userRequest.password)
    if (!checkPassword) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.auth.changePassword.wrong_current_password')));
    }

    const checkNewPassword = body.newPassword === body.confirmPassword
    if (!checkNewPassword) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.auth.changePassword.wrong_confirm_password')));
    }

    const newPassword = await this.authService.hashPassword(body.newPassword);
    await this.userService.update(userRequest.id, { password: newPassword })
    await this.logout(user);
    return true;
  }

  @ApiBearerAuth()
  @Roles(UserRole.MEMBER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('logout')
  async logout(@UserDecorator() user: IUserJwt) {
    await this.authService.logout(user);
    return true;
  }

  @ApiBearerAuth()
  @Roles(UserRole.MEMBER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('push-token-fcm')
  async pushTokenFcm(@UserDecorator() user: IUserJwt, @Body() body: PushFcmTokenDto) {
    await this.firebaseService.subscribeToTopic([body.fcm], TopicNoti.TopicForAllUser);
    return this.userService.update(user.data.id, { fcmToken: body.fcm });
  }
}
