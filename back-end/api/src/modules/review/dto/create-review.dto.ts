import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export const CreateReviewDtoKeys: (keyof CreateReviewDto)[] = ['tourId', 'ratingGuide', 'ratingTransportation', 'ratingValueOfMoney', 'ratingSafety', 'rating', 'title', 'content']

export class CreateReviewDto {
  @ApiProperty({
    example: 1,
    description: 'The id of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly tourId: number;

  @ApiProperty({
    example: 4,
    description: 'Rating Guide',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly ratingGuide: number;

  @ApiProperty({
    example: 5,
    description: 'Rating Transportation',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly ratingTransportation: number;

  @ApiProperty({
    example: 5,
    description: 'Rating value of money',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly ratingValueOfMoney: number;

  @ApiProperty({
    example: 3,
    description: 'Rating Safety',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly ratingSafety: number;

  @ApiProperty({
    example: 5,
    description: 'Rating',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly rating: number;

  @ApiProperty({
    example: 'Good tour, really well organised',
    description: 'Title of review',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: 'The tour was very well organised. One minus is that you get completely bombarded with information.',
    description: 'Content of review',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly content?: string;
}
