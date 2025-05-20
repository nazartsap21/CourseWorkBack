import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../common/dto/register.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { LoginDto } from '../common/dto/login.dto';
import { deleteCookie, getTokenFromCookie } from '../common/utils/cookie.utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Register a new user',
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login a user',
    description: 'Login a user',
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const token = await this.authService.login(loginDto);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'lax',
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout a user',
    description: 'Logout a user',
  })
  logout(@Res() res: Response, @Req() req: Request) {
    const token = getTokenFromCookie(req);
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    deleteCookie(res);

    if (res.cookie['jwt']) {
      throw new HttpException('Logout failed', 500);
    }

    return res.send('Logout successful');
  }

  @Post('check-token')
  @ApiOperation({
    summary: 'Check if token is valid',
    description: 'Check if token is valid',
  })
  async checkToken(@Req() req: Request) {
    const token = getTokenFromCookie(req);
    if (!token) {
      throw new HttpException('Invalid token', 401);
    }
    const isValid = await this.authService.checkToken(token);
    return {
      isAuth: isValid,
    };
  }
}
