import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty, IsString,
  NotContains
} from 'class-validator';

export class ForgotPassword {
  @ApiProperty({
    required: true,
    example: 'johndoe17@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @NotContains(' ')
  readonly email?: string;
}

export class ChangePassword {
  @ApiProperty({
    required: true,
    example: 'Password123@',
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly currentPassword: string;

  @ApiProperty({
    required: true,
    example: 'Password123@',
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly newPassword: string;

  @ApiProperty({
    required: true,
    example: 'Password123@',
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly confirmPassword: string;
}