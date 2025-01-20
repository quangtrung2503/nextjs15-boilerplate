import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { NotificationLogsController } from './notification-log.controller';
import { NotificationLogsService } from './notification-log.service';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';

@Module({
  controllers: [NotificationLogsController],
  providers: [NotificationLogsService],
  exports: [NotificationLogsModule, NotificationLogsService],
  imports: [
    PrismaModule,
    I18nCustomModule,
    forwardRef(() => UserModule),
  ],
})
export class NotificationLogsModule { }
