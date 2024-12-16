import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';
import { PostCustomerController } from './post-customer.controller';

@Module({
  controllers: [PostController, PostCustomerController],
  providers: [PostService],
  exports: [PostModule, PostService],
  imports: [
    PrismaModule,
    I18nCustomModule
  ],
})
export class PostModule {}
