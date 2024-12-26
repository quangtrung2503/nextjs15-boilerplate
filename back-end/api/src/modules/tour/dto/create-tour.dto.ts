import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import moment from 'moment';
import { Package, Transport } from 'src/helpers/constants/enum.constant';

export const CreateTourDtoKeys: (keyof CreateTourDto)[] = ['name', 'price', 'transport', 'package', 'numberOfPeople', 'numberOfHours', 'startDate', 'endDate', 'isFeature', 'description', 'activity', 'included', 'notIncluded', 'safety', 'language', 'cityId', 'themeId', 'destinationIds', 'images'];

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
    example: 2,
    description: 'Number of people of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly numberOfPeople: number;

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
    example: 'See the highlights of London via 2 ...',
    description: 'Description of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: 'See the highlights of London via 2 ...',
    description: 'Activity of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly activity: string;

  @ApiProperty({
    example: 'See the highlights of London via 2 ...',
    description: 'What included of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly included: string;

  @ApiProperty({
    example: 'See the highlights of London via 2 ...',
    description: 'What not included of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly notIncluded: string;

  @ApiProperty({
    example: 'See the highlights of London via 2 ...',
    description: 'Safety of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly safety: string;

  @ApiProperty({
    example: 'See the highlights of London via 2 ...',
    description: 'Details of tour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly language: string;

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
    example: [1, 2, 3],
    description: 'The id of the destination',
    required: true,
    isArray: true,
    type: Number,
  })
  @IsNotEmpty({ each: true })
  @IsNumber({}, { each: true })
  readonly destinationIds: number[];

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