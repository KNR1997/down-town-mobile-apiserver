import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { User } from './user.entity';

export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping',
}

type AddressPayload = {
  zip: string;
  city: string;
  state: string;
  country: string;
  street_address: string;
};

@Entity()
export class Address extends CoreEntity {
  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: AddressType,
    default: AddressType.BILLING,
  })
  type: string;

  @Column({ default: 0 })
  default: boolean;

  @Column({ type: 'json' }) // or 'jsonb' if using PostgreSQL
  address: AddressPayload;

  @Column({ nullable: true })
  location: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user?: User;

  constructor(user?: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
