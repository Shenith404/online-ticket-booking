import { Injectable } from '@nestjs/common';

export interface PaymentRequest {
  amount: number;
  currency: string;
  userId: string;
  eventId: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
}

@Injectable()
export class PaymentService {
  async processPayment(
    _paymentRequest: PaymentRequest,
  ): Promise<PaymentResponse> {
    // Mock payment gateway - always succeed for testing
    const isSuccess = true;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isSuccess) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'Payment processed successfully',
      };
    } else {
      return {
        success: false,
        message: 'Payment failed - insufficient funds or network error',
      };
    }
  }
}
