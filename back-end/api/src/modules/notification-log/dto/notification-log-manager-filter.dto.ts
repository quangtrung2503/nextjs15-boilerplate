import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { FilterOptions } from 'src/helpers/common/filterOption.dto';
import { NotificationType } from 'src/helpers/constants/enum.constant';

export class NotificationLogsFilterManagerDto extends FilterOptions {
  @ApiProperty({
    example: NotificationType.DEFAULT,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  readonly type?: NotificationType;
}
