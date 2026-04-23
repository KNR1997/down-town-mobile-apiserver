import { CoreEntity } from 'src/common/entities/core.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Entity()
export class User extends CoreEntity {
  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  is_active?: boolean;

  @OneToMany(() => Shop, (shop) => shop.owner)
  shops?: Shop[];

  constructor(user?: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
