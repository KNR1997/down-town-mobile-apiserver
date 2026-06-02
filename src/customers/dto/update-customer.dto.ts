import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from 'src/users/dto/address.dto';
import { UpdateProfileDto } from 'src/users/dto/update-profile.dto';

export class UpdateCustomerDto {
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

  profile: UpdateProfileDto;
}
