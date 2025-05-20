import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserDevice } from './userDevice.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => UserDevice, (userDevice) => userDevice.user)
  userDevices: UserDevice[];
}
