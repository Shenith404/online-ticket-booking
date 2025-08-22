import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('api')
export class GatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('BOOKING_SERVICE') private readonly bookingClient: ClientProxy,
    @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
  ) {}

  // Example: Auth login
  @Post('auth/login')
  async login(@Body() data: any) {
    return firstValueFrom(this.authClient.send({ cmd: 'login' }, data));
  }

  // Example: Get booking by ID
  @Get('booking/:id')
  async getBooking(@Param('id') id: string) {
    return firstValueFrom(this.bookingClient.send({ cmd: 'get-booking' }, id));
  }

  // Example: List events
  @Get('events')
  async getEvents() {
    return firstValueFrom(this.eventClient.send({ cmd: 'list-events' }, {}));
  }

  // Example: Send notification
  @Post('notify')
  async notify(@Body() data: any) {
    return firstValueFrom(this.notificationClient.send({ cmd: 'send-notification' }, data));
  }
}
