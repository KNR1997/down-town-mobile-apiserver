import { Category } from 'src/categories/entities/category.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Inventory } from 'src/inventories/entities/inventory.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { StockMovement } from 'src/stock-movements/entities/stock-movement.entity';
import { Type } from 'src/types/entities/type.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

export enum ProductStatus {
  PUBLISH = 'publish',
  DRAFT = 'draft',
}

export enum ProductType {
  SIMPLE = 'simple',
  VARIABLE = 'variable',
}

@Entity()
export class Product extends CoreEntity {
  @Column()
  name!: string;

  @Index({ unique: true })
  @Column()
  slug!: string;

  @ManyToOne(() => Type, (type) => type.products, {
    onDelete: 'CASCADE',
  })
  type?: Type;

  @ManyToMany(() => Category, {
    cascade: false,
  })
  @JoinTable({
    name: 'product_categories',
  })
  categories?: Category[];

  @ManyToOne(() => Shop, (shop) => shop.products, {
    onDelete: 'CASCADE',
  })
  shop?: Shop;

  @Column({ nullable: true })
  sku!: string;

  @Column()
  unit!: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  price!: number;

  @Column()
  quantity!: number;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.SIMPLE,
  })
  product_type!: ProductType;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.PUBLISH,
  })
  status!: ProductStatus;

  @Column({ nullable: true })
  description?: string;

  @Column()
  language!: string;

  @Column('simple-json', { default: ['en'] })
  translated_languages!: string[];

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventories!: Inventory[];

  @OneToMany(() => StockMovement, (stock_movement) => stock_movement.product)
  stock_movements!: StockMovement[];

  constructor(item?: Partial<Product>) {
    super();
    Object.assign(this, item);
  }
}
