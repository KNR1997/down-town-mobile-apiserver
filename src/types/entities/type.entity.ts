import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Type {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  icon: string;

  @Column()
  language: string;

  @Column()
  translated_languages: string[];

  constructor(item: Partial<Type>) {
    Object.assign(this, item);
  }
}
