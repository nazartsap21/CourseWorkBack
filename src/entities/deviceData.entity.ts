import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('device_data')
export class DeviceData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  datetime: Date;

  @Column({ type: 'varchar', length: 16 })
  uniqueDeviceId: string;

  @Column('float')
  tempMin: number;

  @Column('float')
  tempMax: number;

  @Column('float')
  tempAvg: number;

  @Column('float')
  humidityMin: number;

  @Column('float')
  humidityMax: number;

  @Column('float')
  humidityAvg: number;

  @Column('float')
  ppmMin: number;

  @Column('float')
  ppmMax: number;

  @Column('float')
  ppmAvg: number;

  @Column({ type: 'integer', nullable: true })
  airQuality: number;
}
