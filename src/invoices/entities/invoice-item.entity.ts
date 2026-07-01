import { Column, Entity, ManyToOne } from 'typeorm';
import { Invoice } from './invoice.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

@Entity()
export class InvoiceItem extends CoreEntity {
  @Column()
  invoice_id: number;

  @Column()
  order_item_id: number;

  @Column()
  quantity: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  unit_price: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  subtotal: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, {
    onDelete: 'CASCADE',
  })
  invoice: Invoice;
}
