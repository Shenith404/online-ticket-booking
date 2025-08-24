import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          process.env.NOTIFICATION_RABBITMQ_URI || "amqp://localhost:5672",
        ],
        queue: "booking_queue",
        queueOptions: {
          durable: false,
        },
      },
    }
  );

  await app.listen();
  console.log("Notification Service is listening for RabbitMQ messages...");
}
void bootstrap();
