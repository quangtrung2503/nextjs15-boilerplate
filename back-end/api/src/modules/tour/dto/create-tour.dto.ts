import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import moment from 'moment';
import { Duration, Package, Transport } from 'src/helpers/constants/enum.constant';

export const CreateTourDtoKeys: (keyof CreateTourDto)[] = ['name', 'price', 'description', 'transport', 'package', 'duration', 'numberOfHours', 'numberOfPeople', 'startDate', 'endDate', 'isFeature', 'cancellationPolicy', 'healthPrecautions', 'ticketType', 'confirmation', 'guideLanguage' ,'cityId', 'themeId', 'destinationId', 'images'];

export class CreateTourDto {
  @ApiProperty({
    example: 'Westminster to Greenwich River Thames',
    description: 'Name of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 50.50,
    description: 'Price per person of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @ApiProperty({
    example: 'See the highlights of London via 2 ...',
    description: 'Description of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: Transport.TRANSPORT_FACILITY,
    description: 'Transport of tour',
    enum: Transport,
    default: Transport.TRANSPORT_FACILITY,
    required: true,
  })
  @IsEnum(Transport)
  @IsNotEmpty()
  readonly transport: Transport;

  @ApiProperty({
    example: Package.COUPLE_PLAN,
    description: 'Package of tour',
    enum: Package,
    default: Package.COUPLE_PLAN,
    required: true,
  })
  @IsEnum(Package)
  @IsNotEmpty()
  readonly package: Package;

  @ApiProperty({
    example: Duration.THREE_TO_FIVE_HOURS,
    description: 'Duration of tour',
    enum: Duration,
    default: Duration.THREE_TO_FIVE_HOURS,
    required: true,
  })
  @IsEnum(Duration)
  @IsNotEmpty()
  readonly duration: Duration;

  @ApiProperty({
    example: 3.5,
    description: 'Number of hours of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly numberOfHours: number;

  @ApiProperty({
    example: 2,
    description: 'Number of people of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly numberOfPeople: number;

  @ApiProperty({
    example: '2024-09-30',
    description: 'The start date of tour',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value)
      return moment(value ?? null)?.isValid() ? moment(moment(value).format('YYYY-MM-DD')).toDate() : value
  })
  @IsDate()
  readonly startDate: Date;

  @ApiProperty({
    example: '2024-10-05',
    description: 'The end date of tour',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value)
      return moment(value ?? null)?.isValid() ? moment(moment(value).format('YYYY-MM-DD')).toDate() : value
  })
  @IsDate()
  readonly endDate: Date;

  @ApiProperty({
    example: true,
    description: 'Is feature tour',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly isFeature: boolean;

  @ApiProperty({
    example: 'Cancel up to 24 hours in advance to receive a full refund',
    description: 'Cancellation Policy of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly cancellationPolicy: string;

  @ApiProperty({
    example: 'Special health and safety measures apply. Learn more',
    description: 'Health Precautions of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly healthPrecautions: string;

  @ApiProperty({
    example: 'Use your phone or print your voucher',
    description: 'Ticket Type of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly ticketType: string;

  @ApiProperty({
    example: 'Don’t wait for the confirmation!',
    description: 'Confirmation of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly confirmation: string;

  @ApiProperty({
    example: 'English',
    description: 'Guide Language of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly guideLanguage: string;

  @ApiProperty({
    example: 1,
    description: 'The id of the city',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly cityId: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the theme',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly themeId: number;

  @ApiProperty({
    example: 1,
    description: 'The id of the destination',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly destinationId: number;

  @ApiProperty({
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    description: 'Array of image URLs for the tour',
    required: true,
    isArray: true,
    type: String,
  })
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  readonly images: string[];
}