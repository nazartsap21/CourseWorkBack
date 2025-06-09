import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../entities/device.entity';

const token = 't1o2k3e4n5';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
  ) {}
  private generateUniqueDeviceId(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  async getAllDevices(): Promise<Device[]> {
    return this.deviceRepository.find();
  }

  async getDeviceById(uniqueDeviceId: string) {
    return await this.deviceRepository.findOneOrFail({
      where: { uniqueDeviceId: uniqueDeviceId },
      relations: ['userDevices', 'userDevices.user'],
    });
  }

  async createDeviceWithToken(provisionToken: string): Promise<string> {
    if (provisionToken !== token) {
      throw new HttpException(
        'Invalid provisioning token',
        HttpStatus.FORBIDDEN,
      );
    }

    const newDevice = this.deviceRepository.create({
      uniqueDeviceId: this.generateUniqueDeviceId(),
    });

    const savedDevice = await this.deviceRepository.save(newDevice);

    return savedDevice.uniqueDeviceId;
  }

  async createDevice(uniqueDeviceId: string) {
    if (!uniqueDeviceId) {
      throw new HttpException('Invalid uniqueDeviceId', 400);
    } else if (uniqueDeviceId.length !== 16) {
      throw new HttpException('Invalid uniqueDeviceId length', 400);
    }

    const device = this.deviceRepository.create({ uniqueDeviceId });
    return this.deviceRepository.save(device);
  }
}
