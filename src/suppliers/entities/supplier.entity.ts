import { CoreEntity } from 'src/common/entities/core.entity';
import { GoodsReceivedNote } from 'src/grns/entities/grn.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('suppliers')
export class Supplier extends CoreEntity {
  @Column({ unique: true })
  supplier_code!: string;

  @Column()
  company_name!: string;

  @Column({ nullable: true })
  contact_person!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  mobile!: string;

  @Column({ nullable: true })
  address_line_1!: string;

  @Column({ nullable: true })
  address_line_2!: string;

  @Column({ nullable: true })
  city!: string;

  @Column({ nullable: true })
  state!: string;

  @Column({ nullable: true })
  postal_code!: string;

  @Column({ nullable: true })
  country!: string;

  @Column({
    default: true,
  })
  is_active!: boolean;

  @OneToMany(() => GoodsReceivedNote, (grn) => grn.supplier)
  grns!: GoodsReceivedNote[];
}
