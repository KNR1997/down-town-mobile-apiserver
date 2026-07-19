import { CoreEntity } from 'src/common/entities/core.entity';
import { GRNStatus } from 'src/common/enums';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { GoodsReceivedItem } from './grn-item.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { Warehouse } from 'src/warehouses/entities/warehouse.entity';
import { PurchaseOrder } from 'src/purchase-orders/entities/purchase-order.entity';

@Entity()
export class GoodsReceivedNote extends CoreEntity {
  @ManyToOne(() => PurchaseOrder, {
    nullable: true,
  })
  purchase_order!: PurchaseOrder;

  @Column({ unique: true })
  grn_number!: string;

  @ManyToOne(() => Supplier)
  supplier!: Supplier;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @Column({
    type: 'enum',
    enum: GRNStatus,
    default: GRNStatus.DRAFT,
  })
  status!: GRNStatus;

  @Column({ nullable: true })
  supplier_invoice_number!: string;

  @Column({ type: 'date', nullable: true })
  supplier_invoice_date!: Date;

  @Column({ type: 'timestamp' })
  received_at!: Date;

  @Column({ nullable: true })
  remarks!: string;

  @OneToMany(() => GoodsReceivedItem, (item) => item.grn)
  items!: GoodsReceivedItem[];

  @ManyToOne(() => User)
  received_by!: User;

  @Column({ nullable: true })
  purchase_order_number?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  approved_at!: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approved_by!: User;
}
