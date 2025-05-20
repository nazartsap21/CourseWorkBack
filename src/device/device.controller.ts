import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { Device } from '../entities/device.entity';

@ApiTags('Devices')
@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all devices',
    description: 'Retrieve a list of all devices.',
  })
  async getAllDevices() {
    return this.deviceService.getAllDevices();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a device by ID',
    description: 'Retrieve a specific device by its ID.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the device.',
  })
  async getDeviceById(@Param('id') uniqueDeviceId: string) {
    return this.deviceService.getDeviceById(uniqueDeviceId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new device',
    description: 'Create a new device with a unique ID.',
  })
  @ApiBody({
    description: 'The unique ID of the device.',
    schema: {
      type: 'object',
      properties: { uniqueDeviceId: { type: 'string' } },
    },
  })
  async createDevice(@Body('uniqueDeviceId') uniqueDeviceId: string) {
    return this.deviceService.createDevice(uniqueDeviceId);
  }
}
