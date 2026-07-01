import { CoreEntity } from 'src/common/entities/core.entity';
import { AttributeValue } from './attribute-value.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Attribute extends CoreEntity {
  @Column()
  name: string;

  @Column()
  slug: string;

  @OneToMany(() => AttributeValue, (attributeValue) => attributeValue.attribute)
  values: AttributeValue[];

  @Column()
  language: string;

  @Column('simple-json', { default: ['en'] })
  translated_languages: string[];
}
