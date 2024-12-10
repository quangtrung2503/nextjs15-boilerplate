import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import configurationCommon from 'src/helpers/common/configuration.common';
import { UserService } from 'src/modules/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { I18nCustomModule } from 'src/resources/i18n/i18n.module';

@Module({
  imports: [
    JwtModule.register({
      secret: configurationCommon().jwt.secret,
      signOptions: { expiresIn: '30d' },
    }),
    PrismaModule,
    I18nCustomModule
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy, UserService],
  exports: [AuthService],
})

export class AuthModule { }
