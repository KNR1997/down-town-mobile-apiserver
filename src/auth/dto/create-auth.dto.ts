import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsEmail, IsString } from 'class-validator';
import { ShopResponseDto } from 'src/shops/dto/get-shops.dto';
import { ProfileResponseDto } from 'src/users/dto/get-profile.dto';
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
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'admin@demo.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'demodemo',
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
    description: 'The email of the user account',
    example: 'admin@demo.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user account',
    example: 'demodemo',
  })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Access Token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.Wu8CHmArWyjZW9tT5AMpPIFrPixmHcQSady2U0JheA',
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
  id: number;

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

  @ApiProperty({ type: ShopResponseDto, isArray: true })
  @Expose()
  @IsArray()
  @Type(() => ShopResponseDto)
  shops: ShopResponseDto[];

  @Expose()
  @Type(() => ProfileResponseDto)
  profile: ProfileResponseDto;
}
