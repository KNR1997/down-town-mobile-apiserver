import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { InvoiceItem } from './invoice-item.entity';
import { InvoiceStatus } from 'src/common/enums';

@Entity()
export class Invoice extends CoreEntity {
  @Column({ unique: true, type: 'bigint' })
  invoice_number!: number;

  @ManyToOne(() => Order, {
    onDelete: 'CASCADE',
  })
  order!: Order;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  subtotal!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  tax!: number;

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
  shipping_fee!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  total!: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status!: InvoiceStatus;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  issued_at?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  paid_at?: Date;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, {
    cascade: true, // optional but useful
  })
  items!: InvoiceItem[];
}
