import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('simple-json', { default: ["en"] })
  translated_languages: string[];

  constructor(item?: Partial<Type>) {
    super();
    Object.assign(this, item);
  }
}
