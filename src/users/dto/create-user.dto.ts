import { ApiProperty } from '@nestjs/swagger';
import { CustomerResponseDto } from 'src/customers/dto/get-customer.dto';
import { UserResponseDto } from './get-users.dto';

export class CreateUserDto {
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
}

export class CreateUserResponseDto {
  @ApiProperty({ example: 'User created successfully' })
  message: string;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ type: UserResponseDto })
  data: UserResponseDto;
}
