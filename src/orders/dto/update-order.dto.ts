import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto {
  order_status: string;
}
