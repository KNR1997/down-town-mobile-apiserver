import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity()
export class Product extends CoreEntity {
  @Column()
  name: string;

  @Index({ unique: true }) 
  @Column()
  slug: string;

  @Column({ default: true })
  public: boolean;

  constructor(item?: Partial<Product>) {
    super();
    Object.assign(this, item);
  }
}
