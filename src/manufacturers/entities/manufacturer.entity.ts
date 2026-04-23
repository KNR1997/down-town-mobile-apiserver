import { CoreEntity } from 'src/common/entities/core.entity';
import { Type } from 'src/types/entities/type.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Manufacturer extends CoreEntity {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ default: true })
  is_approved?: boolean;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  website?: string;

  @ManyToOne(() => Type, (type) => type.categories, {
    onDelete: 'CASCADE',
  })
  type?: Type;

  @Column()
  language: string;

  @Column('simple-json', { default: ['en'] })
  translated_languages?: string[];
}
