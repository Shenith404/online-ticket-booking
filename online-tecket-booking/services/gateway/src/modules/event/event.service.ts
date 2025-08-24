import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getAllEvents() {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.configService.get('GATEWAY_EVENT_SERVICE_URL')}/events`,
      ),
    );
    return response.data;
  }

  async getEvent(id: string) {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.configService.get('GATEWAY_EVENT_SERVICE_URL')}/events/${id}`,
      ),
    );
    return response.data;
  }

  async createEvent(data: any, token: string) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.configService.get('GATEWAY_EVENT_SERVICE_URL')}/events`,
        data,
        {
          headers: { Authorization: token },
        },
      ),
    );
    return response.data;
  }

  async updateEvent(id: string, data: any, token: string) {
    const response = await firstValueFrom(
      this.httpService.patch(
        `${this.configService.get('GATEWAY_EVENT_SERVICE_URL')}/events/${id}`,
        data,
        {
          headers: { Authorization: token },
        },
      ),
    );
    return response.data;
  }

  async deleteEvent(id: string, token: string) {
    const response = await firstValueFrom(
      this.httpService.delete(
        `${this.configService.get('GATEWAY_EVENT_SERVICE_URL')}/events/${id}`,
        {
          headers: { Authorization: token },
        },
      ),
    );
    return response.data;
  }

  async getAvailableSeats(id: string) {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.configService.get('GATEWAY_EVENT_SERVICE_URL')}/events/${id}/available-seats`,
      ),
    );
    return response.data;
  }
}
