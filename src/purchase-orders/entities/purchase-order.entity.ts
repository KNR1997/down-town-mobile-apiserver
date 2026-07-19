import { CoreEntity } from 'src/common/entities/core.entity';
import { PurchaseOrderStatus } from 'src/common/enums';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { User } from 'src/users/entities/user.entity';
import { Warehouse } from 'src/warehouses/entities/warehouse.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { PurchaseOrderItem } from './purchase-order-item.entity';

@Entity('purchase_orders')
export class PurchaseOrder extends CoreEntity {
  @Column({ unique: true })
  po_number!: string;

  @ManyToOne(() => Supplier)
  supplier!: Supplier;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  status!: PurchaseOrderStatus;

  @Column({
    type: 'date',
  })
  order_date!: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  expected_delivery_date!: Date;

  @Column({
    nullable: true,
  })
  remarks!: string;

  @ManyToOne(() => User)
  created_by!: User;

  @ManyToOne(() => User, { nullable: true })
  approved_by!: User;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  approved_at!: Date;

  @OneToMany(() => PurchaseOrderItem, (item) => item.purchaseOrder, {
    cascade: true,
  })
  items!: PurchaseOrderItem[];
}
