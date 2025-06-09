import { IsString } from 'class-validator';

export class UpdateDeviceDto {
  @IsString()
  deviceId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;
}
