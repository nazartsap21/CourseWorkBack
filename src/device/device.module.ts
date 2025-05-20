import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from '../entities/device.entity';
import { UserDevice } from '../entities/userDevice.entity';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { DeviceData } from '../entities/deviceData.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device, DeviceData, UserDevice, User])],
  providers: [DeviceService],
  controllers: [DeviceController],
})
export class DeviceModule {}
