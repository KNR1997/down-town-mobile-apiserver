import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/common/enums';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
  })
  @IsEnum(OrderStatus)
  order_status!: string;
}

export class UpdateOrderResponseDto {
  @ApiProperty({ example: 'Product updated successfully' })
  message!: string;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ type: UpdateOrderDto })
  data!: UpdateOrderDto;
}
