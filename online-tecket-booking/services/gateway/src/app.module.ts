import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { EventModule } from './modules/event/event.module';
import { BookingModule } from './modules/booking/booking.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.GATEWAY_RABBITMQ_URI || 'amqp://rabbitmq:5672'],
          queue: 'auth_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'BOOKING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.GATEWAY_RABBITMQ_URI || 'amqp://rabbitmq:5672'],
          queue: 'booking_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'EVENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.GATEWAY_RABBITMQ_URI || 'amqp://rabbitmq:5672'],
          queue: 'event_queue',
          queueOptions: { durable: false },
        },
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.GATEWAY_RABBITMQ_URI || 'amqp://rabbitmq:5672'],
          queue: 'notification_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
    AuthModule,
    EventModule,
    BookingModule,
  ],
})
export class AppModule {}
