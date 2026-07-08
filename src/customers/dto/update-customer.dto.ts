import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto {
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
}
