import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = new this.eventModel({
      ...createEventDto,
      availableSeats: createEventDto.totalSeats,
    });
    return event.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // If totalSeats is being updated, adjust availableSeats
    if (updateEventDto.totalSeats !== undefined) {
      const bookedSeats = event.totalSeats - event.availableSeats;
      if (updateEventDto.totalSeats < bookedSeats) {
        throw new BadRequestException(
          'Cannot reduce total seats below booked seats',
        );
      }
      updateEventDto['availableSeats'] =
        updateEventDto.totalSeats - bookedSeats;
    }

    const updatedEvent = await this.eventModel.findByIdAndUpdate(
      id,
      updateEventDto,
      { new: true },
    );

    if (!updatedEvent) {
      throw new NotFoundException('Event not found');
    }

    return updatedEvent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Event not found');
    }
  }

  async updateAvailableSeats(
    eventId: string,
    seatsToReduce: number,
  ): Promise<Event> {
    const event = await this.eventModel.findById(eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.availableSeats < seatsToReduce) {
      throw new BadRequestException('Not enough available seats');
    }

    event.availableSeats -= seatsToReduce;
    return await event.save();
  }

  async getAvailableSeats(eventId: string): Promise<number> {
    const event = await this.findOne(eventId);
    return event.availableSeats;
  }
}
