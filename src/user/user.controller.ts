import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import { getTokenFromCookie } from '../common/utils/cookie.utils';
import { UpdateDeviceDto } from 'src/common/dto/updateDevice.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get user profile with connected devices',
  })
  @UseGuards(JwtGuard)
  async profile(@Req() req: Request) {
    const token = getTokenFromCookie(req);
    if (!token) {
      throw new HttpException('Invalid token', 401);
    }
    return await this.userService.profile(token);
  }

  @Post('connect-device')
  @ApiOperation({
    summary: 'Connect device to user',
    description: 'Connect device to user',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'The ID of the device to connect.' },
      },
      required: ['deviceId'],
    },
  })
  @UseGuards(JwtGuard)
  async connectDevice(@Req() req: Request, @Body('deviceId') deviceId: string) {
    const token = getTokenFromCookie(req);
    if (!token) {
      throw new HttpException('Invalid token', 401);
    }
    return await this.userService.connectDevice(token, deviceId);
  }

  @Post('disconnect-device')
  @ApiOperation({
    summary: 'Disconnect device from user',
    description: 'Disconnect device from user',
  })
  @ApiQuery({
    name: 'deviceId',
    type: 'string',
    description: 'The ID of the device.',
  })
  @UseGuards(JwtGuard)
  async disconnectDevice(
    @Req() req: Request,
    @Query('deviceId') deviceId: string,
  ) {
    const token = getTokenFromCookie(req);
    if (!token) {
      throw new HttpException('Invalid token', 401);
    }
    return await this.userService.disconnectDevice(token, deviceId);
  }

  @Post('update-device')
  @ApiOperation({
    summary: 'Update device name and description',
    description: 'Update device name and description',
  })
  @ApiBody({
    type: UpdateDeviceDto,
    description: 'The details of the device to update.',
  })
  @UseGuards(JwtGuard)
  async updateDevice(
    @Req() req: Request,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    const token = getTokenFromCookie(req);
    if (!token) {
      throw new HttpException('Invalid token', 401);
    }
    const { deviceId, name, description } = updateDeviceDto;
    return await this.userService.updateDevice(
      token,
      deviceId,
      name,
      description,
    );
  }

  @Post('star-device')
  @ApiOperation({
    summary: 'Star a device',
    description: 'Star a device to mark it as favorite',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        deviceId: { type: 'string', description: 'The ID of the device to star.' },
      },
      required: ['deviceId'],
    },
  })
  @UseGuards(JwtGuard)
  async starDevice(@Req() req: Request, @Body('deviceId') deviceId: string) {
    const token = getTokenFromCookie(req);
    if (!token) {
      throw new HttpException('Invalid token', 401);
    }
    return await this.userService.starDevice(token, deviceId);
  }

  @Post('change-password')
  @ApiOperation({
    summary: 'Change user password',
    description: 'Change user password',
  })
  async changePassword(
    @Req() req: Request,
    @Query('newPassword') newPassword: string,
  ) {
    const token = getTokenFromCookie(req);
    if (!token) {
      throw new HttpException('Invalid token', 401);
    }
    return await this.userService.changePassword(token, newPassword);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot password',
    description: 'Forgot password',
  })
  async forgotPassword(
    @Query('email') email: string,
    @Query('newPassword') newPassword: string,
  ) {
    return await this.userService.forgotPassword(email, newPassword);
  }
}
