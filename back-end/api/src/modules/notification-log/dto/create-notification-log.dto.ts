import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TopicNoti } from 'src/core/services/firebase.service';
import { NotificationType } from 'src/helpers/constants/enum.constant';
export const CreateNotificationLogsDtoKeys: (keyof CreateNotificationLogsDto)[] = ['title', 'subTitle', 'imageUrl', 'body', 'data', 'type', 'topic', 'userReceiveIds']

export class SendNotiDto {
  @ApiProperty({
    example: 'Notification Title',
    description: 'The title of the notification',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
    title: string;

  @ApiProperty({
    example: 'Notification Subtitle',
    description: 'The subtitle of the notification',
    required: false,
  })
  @IsOptional()
  @IsString()
    subTitle?: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'The image URL of the notification',
    required: false,
  })
  @IsOptional()
  @IsString()
    imageUrl?: string;

  @ApiProperty({
    example: 'This is the body of the notification.',
    description: 'The body of the notification',
    required: false,
  })
  @IsOptional()
  @IsString()
    body?: string;

  @ApiProperty({
    example: '{"key":"value"}',
    description: 'The data of the notification in JSON format',
    required: false,
  })
  @IsOptional()
  @IsString()
    data?: string;

  @ApiProperty({
    example: NotificationType.DEFAULT,
    description: 'The type of the notification',
    required: true,
    enum: NotificationType
  })
  @IsNotEmpty()
  @IsEnum(NotificationType)
  readonly type: NotificationType;

  // notification with
  // api just use topic or userIReceived,s not both. Logic create will do on BE
  @ApiProperty({
    example: TopicNoti.TopicForAllAdminStaff,
    description: 'The topic',
    required: false,
    enum: TopicNoti,
  })
  @IsOptional()
  @IsEnum(TopicNoti)
    topic?: string;

  @ApiProperty({
    example: '1,2,3',
    description: 'the id of user will receive noti - each other',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value || typeof value != 'string') return null
    return value?.split(',').map((el) => Number(el.trim()))
  })
  @IsArray()
    userReceiveIds?: number[];
}

export class CreateNotificationLogsDto extends SendNotiDto {
}