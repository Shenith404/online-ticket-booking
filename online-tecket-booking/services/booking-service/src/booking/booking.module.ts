import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { HttpModule } from "@nestjs/axios";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { Booking, BookingSchema } from "./schemas/booking.schema";
import { AuthModule } from "../auth/auth.module";
import { PaymentModule } from "../payment/payment.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    HttpModule,
    ClientsModule.register([
      {
        name: "RABBITMQ_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URI ||
              "amqp://admin:password123@localhost:5672",
          ],
          queue: "booking_queue",
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    AuthModule,
    PaymentModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
