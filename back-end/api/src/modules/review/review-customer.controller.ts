import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Prisma, UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { UserDecorator } from 'src/core/auth/decorators/user.decorator';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { CreateReviewDto, CreateReviewDtoKeys } from './dto/create-review.dto';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { TourService } from '../tour/tour.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';
import { calculateRating } from './functions';

@ApiTags('Review (Customer)')
@Controller('review-customer')
export class ReviewCustomerController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nCustomService,
    private readonly tourService: TourService,
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@UserDecorator() user: IUserJwt, @Body() body: CreateReviewDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateReviewDto) => !CreateReviewDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.review.create.wrong_parameter', { keyNotInDto })));

    const tourExists = await this.tourService.findOne({
      where: { id: body.tourId }
    });
    if (!tourExists) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.review.create.tour_not_found')));

    const rating = calculateRating(body);

    return await this.reviewService.create({
      data: {
        ...body,
        rating,
        userId: user.data.id
      }
    })
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@UserDecorator() user: IUserJwt, @Param('id', ParseIdPipe) id: number, @Body() body: UpdateReviewDto) {
    const keyNotInDto = Object.keys(body).find((key: keyof CreateReviewDto) => !CreateReviewDtoKeys.includes(key))
    if (keyNotInDto) throw new BaseException(Errors.BAD_REQUEST(this.i18n.t('common-message.review.update.wrong_parameter', { keyNotInDto })));

    const existingReview = await this.reviewService.findOne({ where: { id } });
    if (!existingReview) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.review.update.not_found')));

    if (existingReview.userId !== user.data.id)
      throw new BaseException(Errors.FORBIDDEN(this.i18n.t('common-message.review.update.forbidden')));

    const updateData: Prisma.ReviewUpdateInput = { ...body };
    if (
      body.ratingGuide ||
      body.ratingTransportation ||
      body.ratingValueOfMoney ||
      body.ratingSafety
    ) {
      const newRatingFields = {
        ratingGuide: body.ratingGuide ?? existingReview.ratingGuide,
        ratingTransportation:
          body.ratingTransportation ?? existingReview.ratingTransportation,
        ratingValueOfMoney:
          body.ratingValueOfMoney ?? existingReview.ratingValueOfMoney,
        ratingSafety: body.ratingSafety ?? existingReview.ratingSafety,
      };
      updateData.rating = calculateRating(newRatingFields);
    }

    return this.reviewService.update(id, updateData);
  }
}
