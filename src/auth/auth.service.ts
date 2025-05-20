import { HttpException, Injectable } from '@nestjs/common';
import { RegisterDto } from '../common/dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../common/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from '../common/dto/jwtPayload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async register(registerDto: RegisterDto) {
    const user = await this.userRepository.find({
      where: { email: registerDto.email },
    });
    if (user.length) throw new HttpException('User already exists', 400);
    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const newUser = this.userRepository.create({
      email: registerDto.email,
      password: passwordHash,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
    });
    return await this.userRepository.save(newUser);
  }

  public async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneOrFail({
      where: { email: loginDto.email },
    });

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new HttpException('Invalid credentials', 401);
    }

    const payload: JwtPayloadDto = {
      email: user.email,
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }
}
