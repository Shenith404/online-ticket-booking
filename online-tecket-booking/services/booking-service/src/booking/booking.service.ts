import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/booking.dto';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @Inject('RABBITMQ_SERVICE') private rabbitClient: ClientProxy,
    private httpService: HttpService,
    private paymentService: PaymentService,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: string,
  ): Promise<Booking> {
    const { eventId, seats } = createBookingDto;

    // Check seat availability with Event Service
    try {
      const eventResponse = await firstValueFrom(
        this.httpService.get(
          `${process.env.EVENT_SERVICE_URL}/events/${eventId}/available-seats`,
        ),
      );

      const availableSeats = eventResponse.data;
      if (availableSeats < seats) {
        throw new BadRequestException('Not enough available seats');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        throw new BadRequestException('Event not found');
      }
      throw new BadRequestException('Unable to verify seat availability');
    }

    // Process payment
    const paymentResult = await this.paymentService.processPayment({
      amount: seats * 50, // $50 per seat
      currency: 'USD',
      userId,
      eventId,
    });

    if (!paymentResult.success) {
      throw new BadRequestException('Payment failed');
    }

    // Reduce available seats in Event Service
    try {
      await firstValueFrom(
        this.httpService.patch(
          `${process.env.EVENT_SERVICE_URL}/events/${eventId}/reduce-seats/${seats}`,
        ),
      );
    } catch {
      throw new BadRequestException('Unable to reserve seats');
    }

    // Create booking
    const booking = new this.bookingModel({
      userId,
      eventId,
      seats,
      status: 'confirmed',
    });

    const savedBooking = await booking.save();

    // Publish booking confirmed event to RabbitMQ
    this.publishBookingConfirmed({
      bookingId: savedBooking._id.toString(),
      userId,
      eventId,
      seats,
      status: 'confirmed',
    });

    return savedBooking;
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.bookingModel.find({ userId }).exec();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  private publishBookingConfirmed(bookingData: any): void {
    try {
      this.rabbitClient.emit('booking.confirmed', bookingData);
      console.log('Booking confirmed event published:', bookingData);
    } catch (error) {
      console.error('Failed to publish booking confirmed event:', error);
    }
  }
}
