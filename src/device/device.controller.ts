import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { DeviceService } from './device.service';

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

  @Post('create-device')
  @ApiOperation({
    summary: 'Create a new device using a provisioning token',
    description:
      'Automatically register a device using a one-time provisioning token.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        provisionToken: {
          type: 'string',
          description: 'The one-time provisioning token.',
        },
      },
      required: ['provisionToken'],
    },
  })
  async createDevice(@Body() body: { provisionToken: string }) {
    const { provisionToken } = body;

    const deviceId =
      await this.deviceService.createDeviceWithToken(provisionToken);
    return { deviceId };
  }
}
