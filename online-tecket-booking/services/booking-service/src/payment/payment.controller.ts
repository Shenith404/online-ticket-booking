import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService, type PaymentRequest } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async processPayment(@Body() paymentRequest: PaymentRequest) {
    return this.paymentService.processPayment(paymentRequest);
  }
}
