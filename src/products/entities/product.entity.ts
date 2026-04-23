import { CoreEntity } from 'src/common/entities/core.entity';
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

  @ManyToOne(() => Type, (type) => type.categories, {
    onDelete: 'CASCADE',
  })
  type?: Type;

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

  constructor(item?: Partial<Product>) {
    super();
    Object.assign(this, item);
  }
}
