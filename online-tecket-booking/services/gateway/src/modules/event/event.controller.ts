import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Get(':id')
  async getEvent(@Param('id') id: string) {
    return this.eventService.getEvent(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async createEvent(
    @Body() eventData: CreateEventDto,
    @Headers('authorization') auth: string,
  ) {
    if (!auth) {
      throw new UnauthorizedException('No authorization token provided');
    }
    return this.eventService.createEvent(eventData, auth);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() eventData: UpdateEventDto,
    @Headers('authorization') auth: string,
  ) {
    if (!auth) {
      throw new UnauthorizedException('No authorization token provided');
    }
    return this.eventService.updateEvent(id, eventData, auth);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteEvent(
    @Param('id') id: string,
    @Headers('authorization') auth: string,
  ) {
    if (!auth) {
      throw new UnauthorizedException('No authorization token provided');
    }
    return this.eventService.deleteEvent(id, auth);
  }

  @Get(':id/available-seats')
  async getAvailableSeats(@Param('id') id: string) {
    return this.eventService.getAvailableSeats(id);
  }
}
