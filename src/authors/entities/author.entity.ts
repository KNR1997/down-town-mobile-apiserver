import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Author extends CoreEntity {
  @Column()
  name: string;

  @Column()
  slug?: string;

  @Column()
  quote?: string;

  @Column()
  bio?: string;

  @Column()
  born?: string;

  @Column()
  death?: string;

  @Column()
  language: string;

  @Column('simple-json', { default: ['en'] })
  translated_languages: string[];

  constructor(item?: Partial<Author>) {
    super();
    Object.assign(this, item);
  }
}
