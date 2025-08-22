import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBooking(
    @Body() bookingData: CreateBookingDto,
    @Headers('authorization') auth: string,
  ) {
    if (!auth) {
      throw new UnauthorizedException('No authorization token provided');
    }
    return this.bookingService.createBooking(bookingData, auth);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyBookings(@Headers('authorization') auth: string) {
    if (!auth) {
      throw new UnauthorizedException('No authorization token provided');
    }
    return this.bookingService.getMyBookings(auth);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getBooking(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    if (!auth) {
      throw new UnauthorizedException('No authorization token provided');
    }
    return this.bookingService.getBooking(id, auth);
  }
}
