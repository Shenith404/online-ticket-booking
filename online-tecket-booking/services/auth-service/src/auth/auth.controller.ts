import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("health")
  health() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "auth-service",
    };
  }

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get("validate")
  validateToken(@Request() req) {
    return {
      valid: true,
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("validate-admin")
  async validateAdmin(@Request() req) {
    const user = req.user;
    if (user.role !== "admin") {
      throw new UnauthorizedException("User is not an admin");
    }
    return {
      valid: true,
      user: user,
    };
  }
}
