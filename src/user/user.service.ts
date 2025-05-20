import { HttpException, Injectable } from '@nestjs/common';
import { JwtPayloadDto } from '../common/dto/jwtPayload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { isValidEmail } from '../common/utils/validation.utils';
import { Device } from '../entities/device.entity';
import { UserDevice } from '../entities/userDevice.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Device) private deviceRepository: Repository<Device>,
    private readonly jwtService: JwtService,
  ) {}

  async profile(token: string) {
    const payload: JwtPayloadDto = this.jwtService.decode(token);
    if (!payload) {
      throw new HttpException('Invalid token', 401);
    }

    const user = await this.userRepository.findOneOrFail({
      where: { id: payload.sub },
      relations: ['userDevices', 'userDevices.device'],
    });

    const { id, password, ...userWithoutPassword } = user;

    return {
      email: userWithoutPassword.email,
      firstName: userWithoutPassword.firstName,
      lastName: userWithoutPassword.lastName,
      userDevices: user.userDevices.map((userDevice) => ({
        id: userDevice.id,
        name: userDevice.name,
        location: userDevice.location,
        device: {
          id: userDevice.device.id,
          uniqueDeviceId: userDevice.device.uniqueDeviceId,
          airQuality: userDevice.device.airQuality,
          lastDataReceived: userDevice.device.lastDataReceived,
        },
      })),
    };
  }

  async connectDevice(token: string, deviceId: string) {
    const payload: JwtPayloadDto = this.jwtService.decode(token);
    if (!payload) {
      throw new HttpException('Invalid token', 401);
    }

    const user = await this.userRepository.findOneOrFail({
      where: { id: payload.sub },
    });

    const existingDevice = await this.deviceRepository.findOne({
      where: { uniqueDeviceId: deviceId },
    });

    if (!existingDevice) {
      throw new HttpException('Device not found', 404);
    }

    const userDeviceRepository =
      this.userRepository.manager.getRepository(UserDevice);

    const existingUserDevice = await userDeviceRepository.findOne({
      where: {
        user: { id: user.id },
        device: { id: existingDevice.id },
      },
      relations: ['user', 'device'],
    });

    if (existingUserDevice) {
      throw new HttpException('Device already connected', 400);
    }

    const newUserDevice = userDeviceRepository.create({
      user,
      device: existingDevice,
      name: 'New Device',
      location: 'Unknown Location',
    });

    await userDeviceRepository.save(newUserDevice);

    return { message: 'Device connected successfully' };
  }

  async disconnectDevice(token: string, deviceId: string) {
    const payload: JwtPayloadDto = this.jwtService.decode(token);
    if (!payload) {
      throw new HttpException('Invalid token', 401);
    }

    const user = await this.userRepository.findOneOrFail({
      where: { id: payload.sub },
    });

    const existingDevice = await this.deviceRepository.findOne({
      where: { uniqueDeviceId: deviceId },
    });

    if (!existingDevice) {
      throw new HttpException('Device not found', 404);
    }

    const userDeviceRepository =
      this.userRepository.manager.getRepository(UserDevice);

    const existingUserDevice = await userDeviceRepository.findOne({
      where: {
        user: { id: user.id },
        device: { id: existingDevice.id },
      },
      relations: ['user', 'device'],
    });

    if (!existingUserDevice) {
      throw new HttpException('Device not connected', 400);
    }

    await userDeviceRepository.remove(existingUserDevice);

    return { message: 'Device disconnected successfully' };
  }

  async updateDevice(
    token: string,
    deviceId: string,
    name: string,
    location: string,
  ) {
    const payload: JwtPayloadDto = this.jwtService.decode(token);
    if (!payload) {
      throw new HttpException('Invalid token', 401);
    }

    const user = await this.userRepository.findOneOrFail({
      where: { id: payload.sub },
    });

    const existingDevice = await this.deviceRepository.findOne({
      where: { uniqueDeviceId: deviceId },
    });

    if (!existingDevice) {
      throw new HttpException('Device not found', 404);
    }

    const userDeviceRepository =
      this.userRepository.manager.getRepository(UserDevice);

    const existingUserDevice = await userDeviceRepository.findOne({
      where: {
        user: { id: user.id },
        device: { id: existingDevice.id },
      },
      relations: ['user', 'device'],
    });

    if (!existingUserDevice) {
      throw new HttpException('Device not connected', 400);
    }

    existingUserDevice.name = name;
    existingUserDevice.location = location;

    await userDeviceRepository.save(existingUserDevice);

    return { message: 'Device updated successfully' };
  }

  async changePassword(token: string, newPassword: string) {
    const payload: JwtPayloadDto = this.jwtService.decode(token);
    if (!payload) {
      throw new HttpException('Invalid token', 401);
    }
    const user = await this.userRepository.findOneOrFail({
      where: { id: payload.sub },
    });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await this.userRepository.update(user.id, { password: passwordHash });

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string, newPassword: string) {
    if (!isValidEmail(email)) {
      throw new HttpException('Invalid email', 400);
    }
    const user = await this.userRepository.findOneOrFail({
      where: { email },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;

    await this.userRepository.update(user.id, { password: passwordHash });

    return { message: 'Password changed successfully' };
  }
}
