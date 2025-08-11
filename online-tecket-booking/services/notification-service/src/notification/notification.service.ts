import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

export interface BookingConfirmedData {
  bookingId: string;
  userId: string;
  eventId: string;
  seats: number;
  status: string;
}

@Injectable()
export class NotificationService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY environment variable is required');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendBookingConfirmationEmail(
    bookingData: BookingConfirmedData,
  ): Promise<void> {
    const { bookingId, userId, eventId, seats } = bookingData;

    const msg = {
      to: `user-${userId}@example.com`, // In real app, fetch user email from database
      from: process.env.FROM_EMAIL || 'noreply@example.com',
      subject: 'Booking Confirmation - Event Ticket',
      text: `Your booking has been confirmed! Booking ID: ${bookingId}, Event ID: ${eventId}, Seats: ${seats}`,
      html: `
        <div>
          <h2>🎟️ Booking Confirmation</h2>
          <p>Great news! Your booking has been confirmed.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            <h3>Booking Details:</h3>
            <ul>
              <li><strong>Booking ID:</strong> ${bookingId}</li>
              <li><strong>Event ID:</strong> ${eventId}</li>
              <li><strong>Number of Seats:</strong> ${seats}</li>
              <li><strong>Status:</strong> ${bookingData.status}</li>
            </ul>
          </div>
          <p>Thank you for choosing our platform!</p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(
        `✅ Email sent successfully to user ${userId} for booking ${bookingId}`,
      );
    } catch (error) {
      console.error('❌ Error sending email:', error);
      // In production, you might want to retry or log to monitoring service
    }
  }
}
