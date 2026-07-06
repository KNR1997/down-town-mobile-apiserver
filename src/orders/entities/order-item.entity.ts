import { Column, Entity, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { DiscountType } from 'src/common/enums/discount-type.enum';

@Entity()
export class OrderItem extends CoreEntity {
  @Column()
  product_id!: number;

  @Column()
  product_name!: string;

  @Column()
  order_quantity!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  unit_price!: number;

  @Column({ default: 0 })
  discount!: number;

  @Column({
    type: 'enum',
    enum: DiscountType,
    nullable: true,
  })
  discount_type!: string;

  @Column({ default: 0 })
  discount_total!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  subtotal!: number;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  order!: Order;
}
