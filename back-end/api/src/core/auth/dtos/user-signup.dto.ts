import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, NotContains } from 'class-validator';

export const UserSignupDtoKeys: (keyof UserSignupDto)[] = ['email', 'name', 'password', 'confirmPassword', 'phone']

export class UserSignupDto {
  @ApiProperty({
    example: 'johndoe17@example.com',
    description: 'The email of the user',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: 'Password123@',
    description: 'The password of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly password: string;

  @ApiProperty({
    example: 'Password123@',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly confirmPassword: string;

  @ApiProperty({
    example: '0923456789',
    description: 'The phone number of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly phone: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
