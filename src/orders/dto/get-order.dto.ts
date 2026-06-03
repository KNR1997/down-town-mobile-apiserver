import { PaginationArgs } from 'src/common/dto/pagination-args.dto';

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Paginator } from 'src/common/dto/paginator.dto';
import { SortOrder } from 'src/common/dto/generic-conditions.dto';
import { UserResponseDto } from 'src/users/dto/get-users.dto';

export class OrderPaginator extends Paginator<OrderResponseDto> {}

export class GetOrdersDto extends PaginationArgs {
  orderBy: QueryOrdersOrderByColumn = QueryOrdersOrderByColumn.NAME;
  sortedBy?: SortOrder;
  search?: string;
  parent?: number | string = 'null';
  language?: string;
}

export enum QueryOrdersOrderByColumn {
  CREATED_AT = 'CREATED_AT',
  NAME = 'NAME',
  UPDATED_AT = 'UPDATED_AT',
}

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  product_id: number;

  @ApiProperty({
    description: 'The order item name',
    example: "Apple",
  })
  @Expose()
  product_name: string;

  @ApiProperty({
    description: 'The order item quantity',
    example: 1,
  })
  @Expose()
  order_quantity: string;

  @ApiProperty({
    description: 'The order item unit price',
    example: 120,
  })
  @Expose()
  unit_price: string;

  @ApiProperty({
    description: 'The order item subtotal',
    example: 120,
  })
  @Expose()
  subtotal: string;
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The tracking_number of the order',
    example: '123232423134',
  })
  @Expose()
  tracking_number: string;

  @ApiProperty({
    description: 'The customer_contact of the order',
    example: '+94113123888',
  })
  @Expose()
  customer_contact: string;

  @ApiProperty({
    description: 'The customer_name of the order',
    example: 'JohnDoe',
  })
  @Expose()
  customer_name: string;

  @ApiProperty({
    description: 'The amount of the order',
    example: '120',
  })
  @Expose()
  amount: string;

  @ApiProperty({
    description: 'The total of the order',
    example: '120',
  })
  @Expose()
  total: string;

  @ApiProperty({
    description: 'The order_status of the order',
    example: '123232423134',
  })
  @Expose()
  order_status: string;

  @ApiProperty({
    description: 'The payment_status of the order',
    example: '123232423134',
  })
  @Expose()
  payment_status: string;

  @ApiProperty({ type: UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  customer: UserResponseDto;

  @ApiProperty({ type: OrderItemResponseDto, isArray: true })
  @Expose()
  @Type(() => OrderItemResponseDto)
  items: OrderItemResponseDto[];

  @ApiProperty({
    description: 'The created date of the order',
    example: '2026-05-11',
  })
  @Expose()
  created_at: string;
}
