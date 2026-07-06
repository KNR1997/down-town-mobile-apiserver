import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { OrderResponseDto } from './get-order.dto';
import { PaymentMethod } from 'src/common/enums';
import { PaymentGateway } from 'src/common/enums/payment-gateway.enum';

export class OrderProductDto {
  @ApiProperty({
    description: 'The id of the product',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'product_id is required' })
  @IsPositive({ message: 'product_id must be a positive number' })
  product_id!: number;

  @ApiProperty({
    description: 'The order quantity of the product',
    example: '1',
  })
  @IsNumber()
  order_quantity!: number;

  @ApiProperty({
    description: 'The subtotal of the products',
    example: 120,
  })
  @IsNumber()
  subtotal!: number;

  @ApiProperty({
    description: 'The unit prict of the product',
    example: 120,
  })
  @IsNumber()
  unit_price!: number;

  @ApiProperty({
    description: 'The discount for a single product unit',
    example: 120,
  })
  @IsNumber()
  discount!: number;

  @ApiProperty({
    description: 'The discount type percentage or fixed',
    example: 120,
  })
  @IsNumber()
  discount_type!: string;

  @ApiProperty({
    description: 'The total discount applied (discount * quantuty)',
    example: 120,
  })
  @IsNumber()
  discount_total!: number;
}

export class CardDetails {
  card_type!: string;
  card_number!: string;
  last_digits!: string;
  expiry_month!: string;
  expiry_year!: string;
  cvv!: number;
  card_holder_name!: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'The customer_id of the order',
    example: '1',
  })
  @IsNumber()
  customer_id!: number;

  @ApiProperty({
    description: 'The amount of the order',
    example: '120',
  })
  @IsNumber()
  amount!: number;

  @ApiProperty({
    description: 'The customer name of the order',
    example: 'Sameera Perera',
  })
  @IsString()
  customer_name!: string;

  @ApiProperty({
    description: 'The customer contact of the order',
    example: '0786753212',
  })
  @IsString()
  customer_contact!: string;

  @ApiProperty({ type: OrderProductDto, isArray: true })
  @IsArray()
  products!: OrderProductDto[];

  @IsString()
  payment_method!: PaymentMethod;

  payment_gateway!: PaymentGateway;

  card_details!: CardDetails;

  gateway_transaction_id!: string;

  process_payment!: boolean;
}

export class CreateOrderResponseDto {
  @ApiProperty({ example: 'Order created successfully' })
  message!: string;

  @ApiProperty({ example: 201 })
  statusCode!: number;

  @ApiProperty({ type: OrderResponseDto })
  data!: OrderResponseDto;
}
