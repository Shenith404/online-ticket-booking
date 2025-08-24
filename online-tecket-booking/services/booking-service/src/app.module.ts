import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { BookingModule } from "./booking/booking.module";
import { AuthModule } from "./auth/auth.module";
import { PaymentModule } from "./payment/payment.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.BOOKING_DB_URI || "mongodb://localhost:27017/booking"
    ),
    BookingModule,
    AuthModule,
    PaymentModule,
  ],
})
export class AppModule {}
