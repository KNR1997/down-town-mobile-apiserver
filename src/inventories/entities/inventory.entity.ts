import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { CoreEntity } from 'src/common/entities/core.entity';
import { Warehouse } from 'src/warehouses/entities/warehouse.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('inventories')
@Unique(['product', 'warehouse'])
export class Inventory extends CoreEntity {
  @ManyToOne(() => Product, (product) => product.inventories, {
    onDelete: 'CASCADE',
  })
  product!: Product;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventories, {
    onDelete: 'CASCADE',
  })
  warehouse!: Warehouse;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  quantity!: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  reserved_quantity!: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  damaged_quantity!: number;
}
