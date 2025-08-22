import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    try {
      const authToken = req.headers.authorization?.split(' ')[1];
      if (!authToken) {
        throw new UnauthorizedException('No token provided');
      }
      
      console.log('Creating booking for user:', req.user.email);
      console.log('Booking details:', createBookingDto);
      
      const booking = await this.bookingService.create(
        createBookingDto,
        req.user.sub,
        authToken
      );
      
      return booking;
    } catch (error) {
      console.error('Booking creation error:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findMyBookings(@Request() req) {
    return this.bookingService.findByUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req) {
    return this.bookingService.findOne(req.params.id);
  }
}
