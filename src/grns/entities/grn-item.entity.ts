import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { GoodsReceivedNote } from './grn.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity()
export class GoodsReceivedItem extends CoreEntity {
  @ManyToOne(() => GoodsReceivedNote, (grn) => grn.items)
  grn!: GoodsReceivedNote;

  @ManyToOne(() => Product)
  product!: Product;

  @Column('decimal')
  quantity!: number;

  @Column('decimal')
  purchase_price!: number;

  @Column('decimal')
  selling_price!: number;

  @Column({
    nullable: true,
  })
  batch_number!: string;

  @Column({
    nullable: true,
    type: 'date',
  })
  expiry_date!: Date;
}
