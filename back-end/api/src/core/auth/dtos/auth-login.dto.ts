import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe17@example.com',
    description: 'The email of the user',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: 'Admin@123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class LogoutDto {
  @ApiProperty({
    example: 'deviceId',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly deviceId: string;
}

