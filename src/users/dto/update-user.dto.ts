import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './address.dto';
import { UpdateProfileDto } from './update-profile.dto';
import { UserResponseDto } from './get-users.dto';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'john',
  })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john@gmail.com',
  })
  email: string;

  address?: AddressDto[];

  @ApiProperty({ type: UpdateProfileDto })
  profile?: UpdateProfileDto;
}

export class UpdateUserResponseDto {
  @ApiProperty({ example: 'User created successfully' })
  message: string;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ type: UserResponseDto })
  data: UserResponseDto;
}
