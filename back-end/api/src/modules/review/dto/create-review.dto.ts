import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Rating } from 'src/helpers/constants/enum.constant';

export const CreateReviewDtoKeys: (keyof CreateReviewDto)[] = ['tourId', 'ratingGuide', 'ratingTransportation', 'ratingValueOfMoney', 'ratingSafety', 'title', 'content']

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
    example: Rating.FIVE,
    description: 'Rating Guide',
    required: true,
    enum: Rating
  })
  @IsNotEmpty()
  @IsEnum(Rating)
  readonly ratingGuide: Rating;

  @ApiProperty({
    example: Rating.FIVE,
    description: 'Rating Transportation',
    required: true,
    enum: Rating
  })
  @IsNotEmpty()
  @IsEnum(Rating)
  readonly ratingTransportation: Rating;

  @ApiProperty({
    example: Rating.FIVE,
    description: 'Rating value of money',
    required: true,
    enum: Rating
  })
  @IsNotEmpty()
  @IsEnum(Rating)
  readonly ratingValueOfMoney: Rating;

  @ApiProperty({
    example: Rating.FIVE,
    description: 'Rating Safety',
    required: true,
    enum: Rating
  })
  @IsNotEmpty()
  @IsEnum(Rating)
  readonly ratingSafety: Rating;

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
