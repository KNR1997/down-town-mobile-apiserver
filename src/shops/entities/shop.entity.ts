import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Shop extends CoreEntity {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => User, (user) => user.shops, {
    onDelete: 'CASCADE',
  })
  owner?: User;
}
