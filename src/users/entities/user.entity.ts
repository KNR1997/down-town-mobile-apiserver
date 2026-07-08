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
import { PermissionType, RoleType } from 'src/common/enums';

@Entity()
export class User extends CoreEntity {
  @Column()
  name!: string;

  @Index({ unique: true })
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ default: true })
  is_active?: boolean;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.STAFF,
  })
  role!: RoleType;

  @Column({
    type: 'enum',
    enum: PermissionType,
    array: true,
    default: [],
  })
  permissions!: PermissionType[];

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
