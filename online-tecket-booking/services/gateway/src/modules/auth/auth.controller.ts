import { Controller, Post, Body, Get, UseGuards, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Headers('authorization') auth: string) {
    if (!auth) {
      throw new UnauthorizedException('No authorization token provided');
    }
    return this.authService.getProfile(auth);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validateToken(@Headers('authorization') auth: string) {
    if (!auth) {
      throw new UnauthorizedException('No authorization token provided');
    }
    return this.authService.validateToken(auth);
  }
}
