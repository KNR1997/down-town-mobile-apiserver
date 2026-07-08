import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { RoleType } from 'src/common/enums';

@Entity()
export class Customer extends CoreEntity {
  @Column()
  name!: string;

  @Column({ unique: true })
  contact_number!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  password!: string;

  @Column({ default: true })
  is_active?: boolean;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.CUSTOMER,
  })
  role!: RoleType;

  @OneToMany(() => Order, (order) => order.customer)
  orders?: Order[];

  constructor(user?: Partial<Customer>) {
    super();
    Object.assign(this, user);
  }
}
