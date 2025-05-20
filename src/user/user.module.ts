import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Device } from '../entities/device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Device]),
    JwtModule.register({
      global: true,
      secret: 'chicken jockey',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
})
export class UserModule {}
