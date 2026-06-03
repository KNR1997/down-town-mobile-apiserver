import { ApiProperty } from '@nestjs/swagger';
import { CreateProfileDto } from 'src/users/dto/create-profile.dto';

export class CreateCustomerDto {
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

  @ApiProperty({
    description: 'The password of the user',
    example: 'Xsdwwe=-21313',
  })
  password: string;

  @ApiProperty({ type: CreateProfileDto })
  profile?: CreateProfileDto;
}
