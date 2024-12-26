import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const CreateVideoDtoKeys: (keyof CreateVideoDto)[] = [
  'title',
  'description',
  'thumbnail',
  'video',
  'isDisplay'
]

export class CreateVideoDto {
  @ApiProperty({
    example: 'We Find The Best Tours For You',
    description: 'Title of video',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint',
    description: 'Description of video',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: 'https://example.com/image1.jpg',
    description: 'Image of video',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly thumbnail: string;

  @ApiProperty({
    example: 'https://example.com/video.mp4',
    description: 'Video',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly video: string;

  @ApiProperty({
    example: true,
    description: 'Is display video',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly isDisplay: boolean;
}
