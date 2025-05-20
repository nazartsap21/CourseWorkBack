import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './user.entity';
import { Device } from './device.entity';

@Entity('user_devices')
export class UserDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userDevices, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Device, (device) => device.userDevices, {
    onDelete: 'CASCADE',
  })
  device: Device;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  location: string;
}
