import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule, ConfigModule, AuthModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
