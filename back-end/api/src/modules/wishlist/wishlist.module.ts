import { forwardRef, Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { UserModule } from '../user/user.module';
import { TourModule } from '../tour/tour.module';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistModule, WishlistService],
  imports: [
    PrismaModule,
    I18nCustomModule,
    forwardRef(() => UserModule),
    forwardRef(() => TourModule)
  ]
})
export class WishlistModule {}
