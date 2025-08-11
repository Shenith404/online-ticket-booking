import { IsString, IsNumber, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  eventId: string;

  @IsNumber()
  @Min(1)
  seats: number;
}
