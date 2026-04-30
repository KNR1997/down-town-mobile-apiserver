import { CoreEntity } from 'src/common/entities/core.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { Type } from 'src/types/entities/type.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

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
  name: string;

  @Index({ unique: true })
  @Column()
  slug: string;

  @ManyToOne(() => Type, (type) => type.products, {
    onDelete: 'CASCADE',
  })
  type?: Type;

  @ManyToOne(() => Shop, (shop) => shop.products, {
    onDelete: 'CASCADE',
  })
  shop?: Shop;

  @Column({ nullable: true })
  sku: string;

  @Column()
  unit: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.SIMPLE,
  })
  product_type: ProductType;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.PUBLISH,
  })
  status: ProductStatus;

  @Column({ nullable: true })
  description?: string;

  @Column()
  language: string;

  @Column('simple-json', { default: ['en'] })
  translated_languages: string[];

  constructor(item?: Partial<Product>) {
    super();
    Object.assign(this, item);
  }
}
