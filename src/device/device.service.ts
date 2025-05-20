import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../entities/device.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAllDevices(): Promise<Device[]> {
    return this.deviceRepository.find();
  }

  async getDeviceById(uniqueDeviceId: string) {
    return await this.deviceRepository.findOneOrFail({
      where: { uniqueDeviceId: uniqueDeviceId },
      relations: ['userDevices', 'userDevices.user'],
    });
  }

  async createDevice(uniqueDeviceId: string) {
    if (!uniqueDeviceId) {
      throw new HttpException('Invalid uniqueDeviceId', 400);
    } else if (uniqueDeviceId.length > 16) {
      throw new HttpException('Invalid uniqueDeviceId', 400);
    }

    const device = this.deviceRepository.create({ uniqueDeviceId });
    return this.deviceRepository.save(device);
  }
}
