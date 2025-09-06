import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";

export interface BookingConfirmedData {
  bookingId: string;
  userId: string;
  eventId: string;
  seats: number;
  status: string;
}

@Injectable()
export class NotificationService {
  private transporter: Transporter;

  constructor() {
    // Create Mailtrap SMTP transport
    this.transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NOTIFICATION_MAILTRAP_USER || "49d631490fd62f",
        pass: process.env.NOTIFICATION_MAILTRAP_PASS || "",
      },
    });
  }

  async sendBookingConfirmationEmail(
    bookingData: BookingConfirmedData
  ): Promise<void> {
    const { bookingId, userId, eventId, seats } = bookingData;

    const mailOptions = {
      from: `"Event Booking Platform" <${
        process.env.NOTIFICATION_FROM_EMAIL || "noreply@example.com"
      }>`,
      to: `user-${userId}@example.com`, // In real app, fetch user email from database
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
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(
        `✅ Email sent successfully to user ${userId} for booking ${bookingId}`
      );
    } catch (error) {
      console.error("❌ Error sending email:", error);
      // In production, you might want to retry or log to monitoring service
    }
  }
}
