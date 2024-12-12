import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import moment from 'moment';
import { Gender } from 'src/helpers/constants/enum.constant';

export const CreateUserDtoKeys: (keyof CreateUserDto)[] = ['username', 'password', 'nickName', 'avatar', 'role', 'status', 'email', 'name', 'phone', 'sex', 'dateOfBirth', 'address']

export class CreateUserDto {
  @ApiProperty({
    example: 'johndoe17',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    example: 'Password123@',
    description: 'The password of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    example: 'johndoe17@example.com',
    description: 'The email of the user',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: '0923456789',
    description: 'The phone number of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({
    example: 'johnny',
    description: 'The nickname of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly nickName?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.png',
    description: 'The avatar URL of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly avatar?: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'The role of the user',
    enum: UserRole,
    default: UserRole.STAFF,
    required: true,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  readonly role: UserRole;

  @ApiProperty({
    example: 'ACTIVE',
    description: 'The status of the user',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    required: true,
  })
  @IsEnum(UserStatus)
  @IsNotEmpty()
  readonly status: UserStatus;

  @ApiProperty({
    example: 'FEMALE',
    description: 'Sex of the user',
    enum: Gender,
    required: false,
  })
  @IsEnum(Gender)
  @IsOptional()
  readonly sex?: Gender;

  @ApiProperty({
    example: '2024-10-30',
    required: false,
    description: 'Date of birth of the user',
  })
  @IsOptional()
  @Transform(({ value }) => moment(value ?? null)?.isValid() ? moment(value).toDate() : value)
  @IsDate()
  readonly dateOfBirth?: Date;

  @ApiProperty({
    example: '123 Main St, City, State, Zip',
    description: 'Address of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly address?: string;
}