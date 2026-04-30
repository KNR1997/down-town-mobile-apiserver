import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile extends CoreEntity {
  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  social: string;

  @Column({ nullable: true })
  contact: string;

  @OneToOne(() => User, (user) => user.profile)
  user?: User;

  constructor(user?: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
