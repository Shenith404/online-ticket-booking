import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async login(data: any) {
    try {
      console.log('Attempting login with:', data);
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.configService.get('AUTH_SERVICE_URL')}/auth/login`,
          data,
        ),
      );
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  }

  async register(data: any) {
    try {
      console.log('Attempting registration with:', data);
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.configService.get('AUTH_SERVICE_URL')}/auth/register`,
          data,
        ),
      );
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  }

  async validateToken(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get('AUTH_SERVICE_URL')}/auth/validate`,
          {
            headers: { Authorization: token },
          },
        ),
      );
      return response.data;
    } catch (error) {
      return false;
    }
  }

  async validateAdminToken(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get('AUTH_SERVICE_URL')}/auth/validate-admin`,
          {
            headers: { Authorization: token },
          },
        ),
      );
      return response.data;
    } catch (error) {
      console.error('Admin validation error:', error.response?.data || error.message);
      return false;
    }
  }

  async getProfile(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get('AUTH_SERVICE_URL')}/auth/profile`,
          {
            headers: { Authorization: token },
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
