import { Injectable } from "@nestjs/common";
import { MailtrapClient } from "mailtrap";

export interface BookingConfirmedData {
  bookingId: string;
  userId: string;
  eventId: string;
  seats: number;
  status: string;
}

@Injectable()
export class NotificationService {
  private mailtrapClient: MailtrapClient;

  constructor() {
    const token = process.env.NOTIFICATION_MAILTRAP_TOKEN;
    if (!token) {
      throw new Error(
        "NOTIFICATION_MAILTRAP_TOKEN environment variable is required"
      );
    }
    this.mailtrapClient = new MailtrapClient({ token });
  }

  async sendBookingConfirmationEmail(
    bookingData: BookingConfirmedData
  ): Promise<void> {
    const { bookingId, userId, eventId, seats } = bookingData;

    const sender = {
      email: process.env.NOTIFICATION_FROM_EMAIL || "noreply@example.com",
      name: "Event Booking Platform",
    };

    const recipients = [
      {
        email: `user-${userId}@example.com`, 
      },
    ];

    try {
      await this.mailtrapClient.send({
        from: sender,
        to: recipients,
        subject: "Booking Confirmation - Event Ticket",
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
      });
      console.log(
        ` Email sent successfully to user ${userId} for booking ${bookingId}`
      );
    } catch (error) {
      console.error(" Error sending email:", error);
    }
  }
}
