import { CoreEntity } from 'src/common/entities/core.entity';
import { Type } from 'src/types/entities/type.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Category extends CoreEntity {
  @Column()
  name: string;

  @Column()
  slug: string;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent?: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children?: Category[];

  @Column({ nullable: true })
  details?: string;

  @Column()
  icon?: string;

  @ManyToOne(() => Type, (type) => type.categories, {
    onDelete: 'CASCADE',
  })
  type?: Type;

  @Column()
  language: string;

  @Column('simple-json', { default: ['en'] })
  translated_languages: string[];
}
