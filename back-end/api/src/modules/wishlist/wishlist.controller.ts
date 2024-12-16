import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CreateWishlistDto, CreateWishlistDtoKeys } from './dto/create-wishlist.dto';
import { WishlistService } from './wishlist.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Prisma, UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { UserService } from '../user/user.service';
import { TourService } from '../tour/tour.service';
import { UserDecorator } from 'src/core/auth/decorators/user.decorator';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { FilterWishlistDto } from './dto/filter-wishlist.dto';
import { funcListPaging } from 'src/helpers/common/list-paging';

@ApiTags('Wishlist (Customer)')
@Controller('wishlist-customer')
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService,
    private readonly i18n: I18nCustomService,
    private readonly userService: UserService,
    private readonly tourService: TourService
  ) {}

  @ApiBearerAuth()
  @Roles(UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async addToWishlist(@UserDecorator() user: IUserJwt, @Body() body: CreateWishlistDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateWishlistDto) => !CreateWishlistDtoKeys.includes(key));
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.wishlist.addToWishlist.wrong_parameter', { keyNotInDto })));

    const tourExists = await this.tourService.findOne({
      where: {
        id: body.tourId
      }
    });
    if (!tourExists) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.wishlist.addToWishlist.not_found')));

    const existingWishlistItem = await this.wishlistService.findOne({
      where: {
        userId: user.data.id,
        tourId: body.tourId,
      },
    });
    if (existingWishlistItem) {
      throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.wishlist.addToWishlist.already_in_wishlist')));
    }
  

    return await this.wishlistService.create({
      data: {
        userId: user.data.id,
        tourId: body.tourId
      }
    });
  }

  @ApiBearerAuth()
  @Roles(UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getWishlist(@UserDecorator() user: IUserJwt, @Query() options: FilterWishlistDto) {
    const where: Prisma.WishlistWhereInput = { userId: user.data.id };
    if (options.textSearch) {
      where.Tour = {
        name: {
          contains: options.textSearch
        }
      }
    }
    const whereInput: Prisma.WishlistFindManyArgs = {
      where: where,
      orderBy: {
        [options?.sortField]: options?.sortOrder
      },
      include: {
        Tour: {
          include: {
            City: true,
            TourImage: true,
            Review: true
          }
        }
      }
    }

    return await funcListPaging(
      this.wishlistService,
      whereInput,
      options?.page,
      options?.perPage,
    );
  }

  @ApiBearerAuth()
  @Roles(UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async removeFromWishlist(@UserDecorator() user: IUserJwt, @Param('id') id: number) {
    const itemWishlist = await this.wishlistService.findOne({ where: { id } });
    if (!itemWishlist) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.wishlist.removeFromWishlist.not_found')));

    if (itemWishlist.userId !== user.data.id) throw new BaseException(Errors.FORBIDDEN());

    return await this.wishlistService.remove({ where: { id } });
  }
}
