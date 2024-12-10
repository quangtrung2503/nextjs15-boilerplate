import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserStatus } from 'src/helpers/constants/enum.constant';
import { UserSignupDto } from 'src/core/auth/dtos/user-signup.dto';

export const UpdateUserDtoKeys: (keyof UpdateUserDto)[] = ['avatar', 'email', 'name', 'nickName', 'phone'];
export class UpdateUserDto extends PartialType(OmitType(UserSignupDto, ['password', 'username'])) {}

export class UpdateUserBannedDto {
  @ApiProperty({
    example: UserStatus.BANNED,
    required: true,
  })
  @IsEnum(UserStatus)
  readonly status: UserStatus;
}