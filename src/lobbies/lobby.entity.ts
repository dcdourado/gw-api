import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { User } from '~/users/user.entity';

@Entity()
export class Lobby {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  leaderId: number;

  @ManyToMany((type) => User)
  @JoinTable()
  players: User[];

  @Column({ default: 0 })
  status: number;

  @Column()
  size: number;
}
