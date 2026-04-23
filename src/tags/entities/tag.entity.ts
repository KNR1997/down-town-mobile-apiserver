import { CoreEntity } from 'src/common/entities/core.entity';
import { Type } from 'src/types/entities/type.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Tag extends CoreEntity {
  @Column()
  name: string;

  @Column()
  slug: string;

//   @ManyToOne(() => Tag, (tag) => tag.children, {
//     nullable: true,
//     onDelete: 'CASCADE',
//   })
//   parent: number;

  @Column({ nullable: true })
  details: string;

  @Column()
  icon: string;

  @ManyToOne(() => Type, (type) => type.tags, {
    onDelete: 'CASCADE',
  })
  type: Type;

  @Column()
  language: string;

  @Column('simple-json', { default: ['en'] })
  translated_languages: string[];
}
