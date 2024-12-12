import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserStatus } from 'src/helpers/constants/enum.constant';
import { CreateUserDto } from './create-user.dto';

export const UpdateUserDtoKeys: (keyof UpdateUserDto)[] = ['avatar', 'email', 'name', 'nickName', 'phone', 'role', 'status', 'sex', 'dateOfBirth', 'address'];
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password', 'username'])) {}

export class UpdateUserBannedDto {
  @ApiProperty({
    example: UserStatus.BANNED,
    required: true,
  })
  @IsEnum(UserStatus)
  readonly status: UserStatus;
}