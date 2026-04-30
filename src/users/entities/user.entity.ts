import { CoreEntity } from 'src/common/entities/core.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Address } from './address.entity';
import { Order } from 'src/orders/entities/order.entity';

export enum RoleType {
  SUPER_ADMIN = 'super_admin',
  STORE_OWNER = 'store_owner',
  CUSTOMER = 'customer',
}

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

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.SUPER_ADMIN,
  })
  role: string;

  @OneToMany(() => Shop, (shop) => shop.owner)
  shops?: Shop[];

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile?: Profile;

  @OneToMany(() => Address, (address) => address.user)
  addresses?: Address[];

  @OneToMany(() => Order, (order) => order.customer)
  orders?: Order[];

  constructor(user?: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
