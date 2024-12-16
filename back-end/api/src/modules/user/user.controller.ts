import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma, User, UserRole, UserStatus } from '@prisma/client';
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
import { CreateUserDto, CreateUserDtoKeys } from './dto/create-user.dto';
import { RegexConstant } from 'src/helpers/constants/regex.constant';
import { AuthService } from 'src/core/auth/auth.service';
import { ListCustomerDto } from './dto/user-filter.dto';
import { funcListPaging } from 'src/helpers/common/list-paging';

@ApiTags('User')
@Controller('user')
// @UseInterceptors(PrismaInterceptor)
export class UserController {
  constructor(
    private readonly i18n: I18nCustomService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@UserDecorator() user: IUserJwt, @Query() options: ListCustomerDto) {
    let where: Prisma.UserWhereInput = { AND: [] };

    if (options.textSearch) {
      // @ts-ignore
      where.AND.push({
        OR: [
          { name: { contains: options.textSearch } },
          { email: { contains: options.textSearch } }
        ]
      });
    }

    if (options.status) {
      where = {
        ...where,
        status: options.status,
      };
    }

    if (options.role) {
      where = {
        ...where,
        role: options.role,
      };
    }

    const whereInput: Prisma.UserFindManyArgs = {
      where,
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      }
    };

    const raw = await funcListPaging(
      this.userService,
      whereInput,
      options?.page,
      options?.perPage,
    );
    const items = raw?.items?.map((value: User) => {
      _excludeObject(value, ['password', 'lastAccessToken'])
      return value
    })
    return { ...raw, items }
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create-user')
  async createUser(@Body() body: CreateUserDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateUserDto) => !CreateUserDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.createUser.wrong_parameter', { keyNotInDto })));

    if (body.username.trim() === '')
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.createUser.username_required')));

    if (body.username.includes(' '))
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.createUser.username_no_spaces')));

    if (!RegexConstant.UsernameReg.test(body.username))
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.createUser.username_invalid_format')));

    if (!RegexConstant.PasswordReg.test(body.password))
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.createUser.invalid_password')));

    if (!RegexConstant.EmailReg.test(body.email))
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.createUser.invalid_email')));

    if (!RegexConstant.PhoneReg.test(body.phone))
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.createUser.invalid_phone')));

    if (body.status === UserStatus.DELETED)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.createUser.invalid_status')));

    const phoneExists = await this.userService.checkPhoneExistsInRoles(
      body.phone,
      [UserRole.ADMIN, UserRole.STAFF],
    );

    if (phoneExists)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.createUser.phone_exists')),);

    const emailExists = await this.userService.checkEmailExistsInRoles(
      body.email,
      [UserRole.ADMIN, UserRole.STAFF],
    );

    if (emailExists)
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.createUser.email_exists')),);

    const hashPassword = await this.authService.hashPassword(body.password)

    const data = await this.userService.create({ data: { ...body, password: hashPassword } });

    _excludeObject(data, ['password', 'lastAccessToken'])
    return data
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile/:id')
  async findOne(@UserDecorator() user: IUserJwt, @Param('id') id: number) {
    let _id = id;
    if (user.role == UserRole.STAFF || user.role == UserRole.CUSTOMER) {
      if (id != user.data.id) throw new BaseException(Errors.FORBIDDEN());
      _id = user.data.id
    }

    const raw = await this.userService.findOne({
      where: { id: _id },
    });
    if (!raw) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.user.findOne.not_found')));
    return _excludeObject(raw, ['password', 'lastAccessToken'])
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@UserDecorator() user: IUserJwt, @Param('id') id: number, @Body() body: UpdateUserDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof UpdateUserDto) => !UpdateUserDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.update.wrong_parameter', { keyNotInDto })));

    let _id = id ? Number(id) : user.data.id // admin can find other profile
    if (user.role == UserRole.STAFF || user.role == UserRole.CUSTOMER) {
      if (!!id && Number(id) != user.data.id) throw new BaseException(Errors.FORBIDDEN());
      _id = user.data.id
      const listIgnore: (keyof UpdateUserDto)[] = ['status', 'role']
      Object.keys(body).forEach((key: keyof UpdateUserDto) => {
        if (listIgnore.includes(key)) throw new BaseException(Errors.FORBIDDEN(this.i18n.t('common-message.user.update.forbidden', { role: user.role, key })));
      })
    }

    const userFound = await this.userService.findOne({ where: { id: _id, status: { notIn: [UserStatus.DELETED] } } });
    if (!userFound) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.update.not_found')));

    if (body.role && body.role == UserRole.CUSTOMER)
      throw new BaseException(Errors.FORBIDDEN(this.i18n.t('common-message.user.update.invalid_role', { role: body.role })));

    const rolesToCheck = user.role === UserRole.CUSTOMER
      ? [UserRole.CUSTOMER]
      : [UserRole.ADMIN, UserRole.STAFF];

    if (body.email && body.email !== userFound.email) {
      const emailExists = await this.userService.checkEmailExistsInRoles(
        body.email,
        rolesToCheck,
      );
      if (emailExists) {
        throw new BaseException(
          Errors.BAD_REQUEST(this.i18n.t('common-message.user.update.email_exists')),
        );
      }
    }

    if (body.phone && body.phone !== userFound.phone) {
      const phoneExists = await this.userService.checkPhoneExistsInRoles(
        body.phone,
        rolesToCheck,
      );
      if (phoneExists) {
        throw new BaseException(
          Errors.BAD_REQUEST(this.i18n.t('common-message.user.update.phone_exists')),
        );
      }
    }

    const updateDto = body;

    const data = await this.userService.update(id, {
      ...updateDto,
    });
    return _excludeObject(data, ['password', 'lastAccessToken'])
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const user = await this.userService.findOne({ where: { id, status: { notIn: [UserStatus.DELETED] } } });
    if (!user) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.user.remove.not_found')));

    return await this.userService.update(id, { status: UserStatus.DELETED });
  }
}
