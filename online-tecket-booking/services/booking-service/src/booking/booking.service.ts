import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ClientProxy } from "@nestjs/microservices";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Booking, BookingDocument } from "./schemas/booking.schema";
import { CreateBookingDto } from "./dto/booking.dto";
import { PaymentService } from "../payment/payment.service";

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @Inject("RABBITMQ_SERVICE") private rabbitClient: ClientProxy,
    private httpService: HttpService,
    private paymentService: PaymentService
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: string,
    authToken: string
  ): Promise<Booking> {
    const { eventId } = createBookingDto;
    let seats: number;
    try {
      seats = Number(createBookingDto.seats);
      if (isNaN(seats)) {
        throw new BadRequestException("Seats must be a valid number");
      }
      if (seats < 1) {
        throw new BadRequestException("Seats must be at least 1");
      }
    } catch (error) {
      throw new BadRequestException(`Invalid seats value: ${error.message}`);
    }

    // Check seat availability with Event Service
    try {
      console.log("Checking seat availability for event:", eventId);
      const eventServiceUrl =
        process.env.BOOKING_EVENT_SERVICE_URL || "http://localhost:3002";
      const availabilityUrl = `${eventServiceUrl}/events/${eventId}/available-seats`;

      const eventResponse = await firstValueFrom(
        this.httpService.get(availabilityUrl, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        })
      );

      const availableSeats = eventResponse.data;
      console.log("Available seats:", availableSeats);

      if (availableSeats < seats) {
        throw new BadRequestException(
          `Not enough available seats. Only ${availableSeats} seats left.`
        );
      }
    } catch (error) {
      console.error(
        "Error checking seat availability:",
        error?.response?.data || error?.message || error
      );
      if (error.response?.status === 404) {
        throw new BadRequestException("Event not found");
      }
      throw new BadRequestException("Unable to verify seat availability");
    }

    // Process payment
    try {
      console.log("Processing payment for seats:", seats);
      const paymentResult = await this.paymentService.processPayment({
        amount: seats * 50, 
        currency: "USD",
        userId,
        eventId,
      });

      if (!paymentResult.success) {
        throw new BadRequestException(
          `Payment failed: ${paymentResult.message}`
        );
      }
      console.log("Payment successful:", paymentResult.transactionId);
    } catch (error) {
      console.error("Payment processing error:", error);
      throw new BadRequestException(
        "Payment failed: " + (error.message || "Unknown error")
      );
    }

    // Reduce available seats in Event Service
    try {
      // Use the auth token passed from the controller
      await firstValueFrom(
        this.httpService.patch(
          `${process.env.BOOKING_EVENT_SERVICE_URL}/events/${eventId}/reduce-seats/${seats}`,
          {}, 
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        )
      );
    } catch (error) {
      console.error(
        "Error reducing seats:",
        error?.response?.data || error?.message || error
      );
      throw new BadRequestException(
        error?.response?.data?.message || "Unable to reserve seats"
      );
    }

    // Create booking
    const booking = new this.bookingModel({
      userId,
      eventId,
      seats,
      status: "confirmed",
    });

    const savedBooking = await booking.save();

    // Publish booking confirmed event to RabbitMQ
    this.publishBookingConfirmed({
      bookingId: savedBooking._id.toString(),
      userId,
      eventId,
      seats,
      status: "confirmed",
    });

    return savedBooking;
  }

  async findByUser(userId: string): Promise<Booking[]> {
    try {
      console.log("Finding bookings for user:", userId);
      const bookings = await this.bookingModel.find({ userId }).exec();
      console.log("Found bookings:", bookings.length);
      return bookings;
    } catch (error) {
      console.error("Error finding bookings:", error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new Error("Booking not found");
    }
    return booking;
  }

  private publishBookingConfirmed(bookingData: any): void {
    try {
      this.rabbitClient.emit("booking.confirmed", bookingData);
      console.log("Booking confirmed event published:", bookingData);
    } catch (error) {
      console.error("Failed to publish booking confirmed event:", error);
    }
  }
}
