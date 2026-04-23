import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

enum Permission {
  SUPER_ADMIN = 'Super admin',
  STORE_OWNER = 'Store owner',
  STAFF = 'Staff',
  CUSTOMER = 'Customer',
}

export class RegisterDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'Alice',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'alice@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  @IsString()
  password: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The name of the user',
    example: 'Alice',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'alice@gmail.com',
  })
  @Expose()
  email: string;
}

export class CreateAuthDto {}

export class AuthResponse {
  token: string;
  permissions: string[];
  role?: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'alice@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'The slug of the product',
    example: 'password',
  })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Access Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.Wu8CHmArWyjZW9tT5AMpPIFrPixmHcQSady2U0JheA',
  })
  @Expose()
  token: string;

  @ApiProperty({
    description: 'The id of the login user',
    example: '1',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'The username of the login user',
    example: 'alice',
  })
  @Expose()
  username: string;
}

export class MeResponseDto {
  @ApiProperty({
    description: 'The id of the login user',
    example: '1',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'The name of the login user',
    example: 'Alice',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The email of the login user',
    example: 'alice@gmail.com',
  })
  @Expose()
  email: string;
}
