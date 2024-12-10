import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { UserDecorator } from 'src/core/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { _excludeObject } from 'src/helpers/functions/common.utils';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { UpdateUserBannedDto, UpdateUserDto, UpdateUserDtoKeys } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
// @UseInterceptors(PrismaInterceptor)
export class UserController {
  constructor(
    private readonly i18n: I18nCustomService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.MEMBER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('banned/:id')
  async banned(@Param('id') id: number, @Body() body: UpdateUserBannedDto) {
    const userFound = await this.userService.findOne({ where: { id, status: { notIn: [UserStatus.DELETED] } } });
    if (!userFound) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.banned.not_found')));

    if (body.status === UserStatus.BANNED) {
      return this.userService.update(id, { status: UserStatus.BANNED });
    } else {
      return this.userService.update(id, { status: UserStatus.ACTIVE });
    }
  }

  @ApiBearerAuth()
  @Roles(UserRole.MEMBER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile/:id')
  async findOne(@UserDecorator() user: IUserJwt, @Param('id') id: number) {
    if (id != user.data.id) throw new BaseException(Errors.FORBIDDEN());


    const raw = await this.userService.findOne({
      where: { id: id },
    });
    if (!raw) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.user.findOne.not_found')));
    return _excludeObject(raw, ['password', 'lastAccessToken'])
  }

  @ApiBearerAuth()
  @Roles(UserRole.MEMBER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@UserDecorator() user: IUserJwt, @Param('id') id: number, @Body() body: UpdateUserDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof UpdateUserDto) => !UpdateUserDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.update.wrong_parameter', { keyNotInDto })));

    if (!!id && Number(id) != user.data.id) throw new BaseException(Errors.FORBIDDEN());
      
    const userFound = await this.userService.findOne({ where: { id: id, status: { notIn: [UserStatus.DELETED] } } });
    if (!userFound) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.update.not_found')));

    const updateDto = body;

    const data = await this.userService.update(id, {
      ...updateDto,
    });
    return _excludeObject(data, ['password', 'lastAccessToken'])
  }
}
