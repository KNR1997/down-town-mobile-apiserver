import { CoreEntity } from 'src/common/entities/core.entity';
import { GoodsReceivedNote } from 'src/grns/entities/grn.entity';
import { Inventory } from 'src/inventories/entities/inventory.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('warehouses')
export class Warehouse extends CoreEntity {
  @Column({ unique: true })
  warehouse_code!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

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

  @OneToMany(() => Inventory, (inventory) => inventory.warehouse)
  inventories!: Inventory[];

  @OneToMany(() => GoodsReceivedNote, (grn) => grn.warehouse)
  grns!: GoodsReceivedNote[];
}
