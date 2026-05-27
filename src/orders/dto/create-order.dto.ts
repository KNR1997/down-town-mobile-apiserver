import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class OrderProductDto {
  product_id: number;
  order_quantity: number;
  subtotal: number;
  unit_price: number;
}

export class CreateOrderDto {
  // @ApiProperty({
  //   description: 'The customer_id of the order',
  //   example: '1',
  // })
  // @IsNumber()
  // customer_id: number;

  @ApiProperty({
    description: 'The amount of the order',
    example: '120',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The customer name of the order',
    example: 'Sameera Perera',
  })
  @IsString()
  customer_name: string;

  @ApiProperty({
    description: 'The customer contact of the order',
    example: '0786753212',
  })
  @IsString()
  customer_contact: string;

  products: OrderProductDto[];
}
