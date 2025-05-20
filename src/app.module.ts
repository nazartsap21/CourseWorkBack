import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from './config/db.config';
import { AuthModule } from './auth/auth.module';
import { DeviceModule } from './device/device.module';
import { DeviceDataModule } from './device-data/device-data.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(dataSource.options),
    AuthModule,
    DeviceModule,
    DeviceDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
