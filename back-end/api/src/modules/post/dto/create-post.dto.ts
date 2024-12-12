import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export const CreatePostDtoKeys: (keyof CreatePostDto)[] = ['title', 'image', 'content'];

export class CreatePostDto {
  @ApiProperty({
    example: '7 Signs and Symptoms of Iodine Deficiency',
    description: 'Title of the Post',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'The image URL of the Post',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly image: string;

  @ApiProperty({
    example: 'Content of the Post',
    description: 'Content of the Post',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly content: string;
}