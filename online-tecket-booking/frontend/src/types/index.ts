export interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: "admin" | "user";
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  totalSeats: number;
  availableSeats: number;
  createdAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  venue: string;
  totalSeats: number;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  date?: string;
  venue?: string;
  totalSeats?: number;
}

export interface Booking {
  _id: string;
  userId: string;
  eventId: string;
  seats: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface CreateBookingRequest {
  eventId: string;
  seats: number;
}

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

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
