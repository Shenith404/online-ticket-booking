import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  NotificationService,
  type BookingConfirmedData,
} from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('booking.confirmed')
  async handleBookingConfirmed(@Payload() data: BookingConfirmedData) {
    console.log('📧 Received booking confirmation event:', data);
    await this.notificationService.sendBookingConfirmationEmail(data);
  }
}
