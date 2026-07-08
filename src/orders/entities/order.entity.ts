import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { OrderStatus, PaymentStatus } from 'src/common/enums';
import { Customer } from 'src/customers/entities/customer.entity';

@Entity()
export class Order extends CoreEntity {
  @Column({ unique: true, type: 'bigint' })
  tracking_number!: number;

  @Column()
  customer_contact!: string;

  @Column()
  customer_name!: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  amount!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  sales_tax!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  paid_total!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  total!: number;

  @Column({ nullable: true })
  note!: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  cancelled_amount!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  cancelled_tax!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  cancelled_delivery_fee!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  discount!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  delivery_fee!: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  order_status!: string;

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
  payment_status!: string;

  // @ManyToOne(() => User, (user) => user.orders, {
  //   nullable: true,
  //   onDelete: 'CASCADE',
  // })
  // customer?: User;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  customer?: Customer;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true, // optional but useful
  })
  items!: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order, {
    cascade: true,
  })
  payments!: Payment[];
}
