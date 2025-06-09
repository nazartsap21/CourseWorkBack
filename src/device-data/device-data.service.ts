import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceData } from '../entities/deviceData.entity';
import { Device } from '../entities/device.entity';

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

    const datetimeString = data.datetime as unknown as string;
    const datetimeParts = datetimeString.split(',');
    if (datetimeParts.length !== 2) {
      throw new BadRequestException('Invalid datetime format');
    }

    const [timePart, datePart] = datetimeParts;
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    const [day, month, year] = datePart.split('/').map(Number);

    const parsedDatetime = new Date(
      year,
      month - 1,
      day,
      hours,
      minutes,
      seconds,
    );
    if (isNaN(parsedDatetime.getTime())) {
      throw new BadRequestException('Invalid datetime value');
    }

    const deviceData = this.deviceDataRepository.create({
      ...data,
      uniqueDeviceId: deviceId,
      datetime: parsedDatetime,
    });

    device.lastDataReceived = parsedDatetime;
    if (data.airQuality) {
      deviceData.airQuality = data.airQuality;
      device.airQuality = data.airQuality;
    }

    await this.deviceRepository.save(device);
    await this.deviceDataRepository.save(deviceData);

    return { message: 'Data added successfully' };
  }
}
