import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { PrismaService } from 'prisma/prisma.service';
import { I18nCustomService } from 'src/resources/i18n/i18n.service';
import { TourService } from '../tour/tour.service';
import { ReviewHelpfulService } from './review-helpful.service';
import { Roles } from 'src/core/auth/decorators/roles.decorator';
import { Prisma, UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { FilterReviewDto } from '../tour/dto/filter-review.dto';
import { funcListPaging } from 'src/helpers/common/list-paging';
import { BaseException, Errors } from 'src/helpers/constants/error.constant';
import { ParseIdPipe } from 'src/core/pipes/parse-id.pipe';

@ApiTags('Review (Administrator)')
@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nCustomService,
    private readonly tourService: TourService,
    private readonly reviewHelpfulService: ReviewHelpfulService
  ) { }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() options: FilterReviewDto) {
    let where: Prisma.ReviewWhereInput = {};

    if (options.textSearch) {
      where = {
        ...where,
        OR: [
          { title: { contains: options.textSearch } },
          {
            User: {
              OR: [
                { name: { contains: options.textSearch } },
                { email: { contains: options.textSearch } }
              ]
            }
          },
        ]
      }
    }

    if (options.ratings) {
      where = {
        ...where,
        rating: { in: options.ratings }
      }
    }

    const whereInput: Prisma.ReviewFindManyArgs = {
      where: where,
      orderBy: {
        [options?.sortField]: options?.sortOrder,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        }
      }
    }

    return await funcListPaging(
      this.reviewService,
      whereInput,
      options?.page,
      options?.perPage,
    );
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('set-active/:id')
  async setActive(@Param('id', ParseIdPipe) id: number) {
    const existingReview = await this.reviewService.findOne({ where: { id } });
    if (!existingReview) throw new BaseException(Errors.ITEM_NOT_FOUND(this.i18n.t('common-message.review.setActive.not_found')));

    return await this.reviewService.update(existingReview.id, { isActive: !existingReview.isActive });

  }
}