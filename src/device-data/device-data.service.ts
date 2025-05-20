import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceData } from '../entities/deviceData.entity';
import { Device } from '../entities/device.entity';
import { airQualityScore } from '../common/utils/airQuality.utils';

@Injectable()
export class DeviceDataService {
  constructor(
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
    @InjectRepository(DeviceData)
    private deviceDataRepository: Repository<DeviceData>,
  ) {}

  async getDeviceDataByDeviceId(deviceId: string) {
    return this.deviceDataRepository.find({
      where: { uniqueDeviceId: deviceId },
    });
  }

  async addDeviceData(deviceId: string, data: Partial<DeviceData>) {
    const device = await this.deviceRepository.findOneOrFail({
      where: { uniqueDeviceId: deviceId },
    });
    const deviceData = this.deviceDataRepository.create({
      ...data,
      uniqueDeviceId: deviceId,
    });
    deviceData.datetime = new Date();
    device.lastDataReceived = new Date();
    let airQuality: number;
    if (data.tempAvg && data.humidityAvg && data.ppmAvg) {
      airQuality = airQualityScore(data.tempAvg, data.humidityAvg, data.ppmAvg);
    } else {
      airQuality = 0;
    }
    deviceData.airQuality = airQuality;
    device.airQuality = airQuality;
    await this.deviceRepository.save(device);
    await this.deviceDataRepository.save(deviceData);
    return { message: 'Data added successfully' };
  }
}
