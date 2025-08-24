import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BookingService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createBooking(data: any, token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.configService.get('GATEWAY_BOOKING_SERVICE_URL')}/bookings`,
          data,
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

  async getMyBookings(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get('GATEWAY_BOOKING_SERVICE_URL')}/bookings`,
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

  async getBooking(id: string, token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get('GATEWAY_BOOKING_SERVICE_URL')}/bookings/${id}`,
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
