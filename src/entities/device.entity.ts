import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserDevice } from './userDevice.entity';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 16 })
  uniqueDeviceId: string;

  @Column({ type: 'integer', nullable: true })
  airQuality: number;

  @Column({ type: 'timestamp', nullable: true })
  lastDataReceived: Date;

  @OneToMany(() => UserDevice, (userDevice) => userDevice.device)
  userDevices: UserDevice[];
}
