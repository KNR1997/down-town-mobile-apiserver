import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'order-pending',
  PROCESSING = 'order-processing',
  COMPLETED = 'order-completed',
  CANCELLED = 'order-cancelled',
  REFUNDED = 'order-refunded',
  FAILED = 'order-failed',
  AT_LOCAL_FACILITY = 'order-at-local-facility',
  OUT_FOR_DELIVERY = 'order-out-for-delivery',
}

export enum PaymentStatus {
  PENDING = 'payment-pending',
  PROCESSING = 'payment-processing',
  SUCCESS = 'payment-success',
  FAILED = 'payment-failed',
  REVERSAL = 'payment-reversal',
  COD = 'payment-cash-on-delivery',
}

@Entity()
export class Order extends CoreEntity {
  @Column({ unique: true })
  tracking_number: string;

  @Column()
  customer_contact: string;

  @Column()
  customer_name: string;

  @Column()
  amount: number;

  @Column({ default: 0 })
  sales_tax: number;

  @Column()
  paid_total: number;

  @Column()
  total: number;

  @Column({ nullable: true })
  note: string;

  @Column({ default: 0 })
  cancelled_amount: number;

  @Column({ default: 0 })
  cancelled_tax: number;

  @Column({ default: 0 })
  cancelled_delivery_fee: number;

  @Column({ default: 0 })
  discount: number;

  @Column({ default: 0 })
  delivery_fee: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  order_status: string;

  // @Column({
  //   type: 'enum',
  //   enum: OrderStatus,
  //   default: OrderStatus.PENDING,
  // })
  // delivery_time: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  payment_status: string;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  customer?: User;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true, // optional but useful
  })
  items: OrderItem[];
}
