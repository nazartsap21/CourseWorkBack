import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDate } from 'class-validator';

export class DeviceDataDto {
  @ApiProperty({
    example: 15.5,
    description: 'The minimum temperature recorded.',
  })
  @IsNumber()
  tempMin: number;

  @ApiProperty({
    example: 25.3,
    description: 'The maximum temperature recorded.',
  })
  @IsNumber()
  tempMax: number;

  @ApiProperty({
    example: 20.1,
    description: 'The average temperature recorded.',
  })
  @IsNumber()
  tempAvg: number;

  @ApiProperty({ example: 30.2, description: 'The minimum humidity recorded.' })
  @IsNumber()
  humidityMin: number;

  @ApiProperty({ example: 60.5, description: 'The maximum humidity recorded.' })
  @IsNumber()
  humidityMax: number;

  @ApiProperty({ example: 45.3, description: 'The average humidity recorded.' })
  @IsNumber()
  humidityAvg: number;

  @ApiProperty({ example: 400, description: 'The minimum ppm recorded.' })
  @IsNumber()
  ppmMin: number;

  @ApiProperty({ example: 800, description: 'The maximum ppm recorded.' })
  @IsNumber()
  ppmMax: number;

  @ApiProperty({ example: 600, description: 'The average ppm recorded.' })
  @IsNumber()
  ppmAvg: number;
}
