import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'prisma/prisma.service';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { UserDecorator } from 'src/core/auth/decorators/user.decorator';
import { IUserJwt } from 'src/core/auth/strategies/jwt.strategy';
import { CreateReviewDto, CreateReviewDtoKeys } from './dto/create-review.dto';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { TourService } from '../tour/tour.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewHelpfulService } from './review-helpful.service';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';

@ApiTags('Review (Customer)')
@Controller('review-customer')
export class ReviewCustomerController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nCustomService,
    private readonly tourService: TourService,
    private readonly reviewHelpfulService: ReviewHelpfulService
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

    return await this.reviewService.create({
      data: {
        ...body,
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

    return this.reviewService.update(id,
      {
        ...body,
        User: {
          connect: { id: user.data.id }
        }
      }
    );
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('helpful/:id')
  async updateHelpful(@UserDecorator() user: IUserJwt, @Param('id', ParseIdPipe) id: number) {
    const existingReview = await this.reviewService.findOne({ where: { id } });
    if (!existingReview) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.review.updateHelpful.not_found')));

    const existingHelpful = await this.prismaService.reviewHelpful.findUnique({
      where: {
        userId_reviewId: {
          userId: user.data.id,
          reviewId: id
        }
      }
    });


    if (existingHelpful) {
      await Promise.all([
        this.reviewHelpfulService.remove({
          where: {
            id: existingHelpful.id
          }
        }),
        this.reviewService.update(id, {
          countHelpful: {
            decrement: 1
          }
        })
      ]);
    } else {
      await Promise.all([
        this.reviewHelpfulService.create({
          data: {
            userId: user.data.id,
            reviewId: id
          }
        }),
        this.reviewService.update(id, {
          countHelpful: {
            increment: 1
          }
        })
      ]);
    }

    const updatedReview = await this.reviewService.findOne({ where: { id } });

    return updatedReview;
  }
}
