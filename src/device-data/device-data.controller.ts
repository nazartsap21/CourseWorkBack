import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DeviceDataService } from './device-data.service';
import { DeviceDataDto } from '../common/dto/deviceData.dto';

@Controller('device-data')
export class DeviceDataController {
  constructor(private readonly deviceDataService: DeviceDataService) {}

  @Get(':deviceId')
  async getDeviceDataByDeviceId(@Param('deviceId') deviceId: string) {
    return this.deviceDataService.getDeviceDataByDeviceId(deviceId);
  }

  @Post(':deviceId')
  async addDeviceData(
    @Param('deviceId') deviceId: string,
    @Body() data: DeviceDataDto,
  ) {
    return this.deviceDataService.addDeviceData(deviceId, data);
  }
}
