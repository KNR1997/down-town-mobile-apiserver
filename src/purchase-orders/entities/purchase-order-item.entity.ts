import { Column, Entity, ManyToOne } from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Product } from 'src/products/entities/product.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItem extends CoreEntity {
  @ManyToOne(() => PurchaseOrder, (po) => po.items, {
    onDelete: 'CASCADE',
  })
  purchaseOrder!: PurchaseOrder;

  @ManyToOne(() => Product)
  product!: Product;

  @Column('decimal')
  ordered_quantity!: number;

  @Column({
    type: 'decimal',
    default: 0,
  })
  received_quantity!: number;

  @Column('decimal')
  purchase_price!: number;

  @Column({
    type: 'decimal',
    default: 0,
  })
  line_total!: number;
}
