import { Column, Entity, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

@Entity()
export class OrderItem extends CoreEntity {
  @Column()
  product_id: number;

  @Column()
  product_name: string;

  @Column()
  order_quantity: number;

  @Column()
  unit_price: number;

  @Column()
  subtotal: number;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  order: Order;
}
