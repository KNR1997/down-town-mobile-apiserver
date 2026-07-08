import { ApiProperty } from '@nestjs/swagger';
import { CreateProfileDto } from 'src/users/dto/create-profile.dto';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'The name of the customer',
    example: 'john',
  })
  name!: string;

  @ApiProperty({
    description: 'The contact number of the customer',
    example: '011123456',
  })
  contact_number!: string;

  @ApiProperty({
    description: 'The email of the customer',
    example: 'john@gmail.com',
  })
  email!: string;

  @ApiProperty({
    description: 'The password of the customer',
    example: 'Xsdwwe=-21313',
  })
  password!: string;

  // @ApiProperty({ type: CreateProfileDto })
  // profile?: CreateProfileDto;
}
