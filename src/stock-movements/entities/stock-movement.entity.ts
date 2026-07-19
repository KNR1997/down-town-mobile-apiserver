import { CoreEntity } from 'src/common/entities/core.entity';
import { StockMovementType } from 'src/common/enums';
import { Product } from 'src/products/entities/product.entity';
import { Warehouse } from 'src/warehouses/entities/warehouse.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class StockMovement extends CoreEntity {
  @ManyToOne(() => Product)
  product!: Product;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @Column({
    type: 'enum',
    enum: StockMovementType,
  })
  type!: StockMovementType;

  @Column()
  quantity!: number;

  @Column()
  reference_id!: number;

  @Column()
  reference_number!: number;

  @Column()
  reference_type!: string;

  @Column()
  balance_after!: number;
}
