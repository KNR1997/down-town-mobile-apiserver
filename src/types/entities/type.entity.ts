import { Category } from 'src/categories/entities/category.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Manufacturer } from 'src/manufacturers/entities/manufacturer.entity';
import { Product } from 'src/products/entities/product.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Type extends CoreEntity {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  icon: string;

  @Column()
  language: string;

  @Column('simple-json', { default: ['en'] })
  translated_languages: string[];

  @OneToMany(() => Category, (category) => category.type)
  categories: Category[];

  @OneToMany(() => Manufacturer, (manufacturer) => manufacturer.type)
  manufacturers: Manufacturer[];

  @OneToMany(() => Tag, (tag) => tag.type)
  tags: Tag[];

  @OneToMany(() => Product, (product) => product.type)
  products: Product[];

  constructor(item?: Partial<Type>) {
    super();
    Object.assign(this, item);
  }
}
