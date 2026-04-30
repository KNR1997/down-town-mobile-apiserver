import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './address.dto';
import { UpdateProfileDto } from './update-profile.dto';

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

  profile?: UpdateProfileDto;
}
