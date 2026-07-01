import { CoreEntity } from 'src/common/entities/core.entity';
import { Attribute } from './attribute.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class AttributeValue extends CoreEntity {
  @Column()
  value: string;

  @Column()
  meta?: string;

  @ManyToOne(() => Attribute, (attribute) => attribute.values, {
    onDelete: 'CASCADE',
  })
  attribute: Attribute;

  @Column()
  language: string;
}
