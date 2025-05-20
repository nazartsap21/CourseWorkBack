import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceDataController } from './device-data.controller';
import { DeviceDataService } from './device-data.service';
import { DeviceData } from '../entities/deviceData.entity';
import { Device } from '../entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceData, Device])],
  providers: [DeviceDataService],
  controllers: [DeviceDataController],
  exports: [TypeOrmModule],
})
export class DeviceDataModule {}
