import axios, { AxiosInstance, AxiosError } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

class ApiClient {
  private authClient: AxiosInstance;
  private eventClient: AxiosInstance;
  private bookingClient: AxiosInstance;

  constructor() {
    // Auth Service Client
    this.authClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Event Service Client
    this.eventClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_EVENT_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Booking Service Client
    this.bookingClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptors to include auth token
    [this.authClient, this.eventClient, this.bookingClient].forEach(
      (client) => {
        client.interceptors.request.use(
          (config) => {
            const token = Cookies.get("access_token");
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
          },
          (error) => Promise.reject(error)
        );

        // Add response interceptors for error handling
        client.interceptors.response.use(
          (response) => response,
          (error: AxiosError) => {
            if (error.response?.status === 401) {
              Cookies.remove("access_token");
              Cookies.remove("user");
              window.location.href = "/auth/login";
              toast.error("Session expired. Please login again.");
            }
            return Promise.reject(error);
          }
        );
      }
    );
  }

  // Auth Service Methods
  async login(email: string, password: string) {
    const response = await this.authClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  }

  async register(email: string, password: string, role?: string) {
    const response = await this.authClient.post("/auth/register", {
      email,
      password,
      role,
    });
    return response.data;
  }

  async getProfile() {
    const response = await this.authClient.get("/auth/profile");
    return response.data;
  }

  async validateToken() {
    const response = await this.authClient.get("/auth/validate");
    return response.data;
  }

  // Event Service Methods
  async getEvents() {
    const response = await this.eventClient.get("/events");
    return response.data;
  }

  async getEvent(id: string) {
    const response = await this.eventClient.get(`/events/${id}`);
    return response.data;
  }

  async createEvent(eventData: any) {
    const response = await this.eventClient.post("/events", eventData);
    return response.data;
  }

  async updateEvent(id: string, eventData: any) {
    const response = await this.eventClient.patch(`/events/${id}`, eventData);
    return response.data;
  }

  async deleteEvent(id: string) {
    const response = await this.eventClient.delete(`/events/${id}`);
    return response.data;
  }

  async getAvailableSeats(eventId: string) {
    const response = await this.eventClient.get(
      `/events/${eventId}/available-seats`
    );
    return response.data;
  }

  // Booking Service Methods
  async createBooking(eventId: string, seats: number) {
    const response = await this.bookingClient.post("/bookings", {
      eventId,
      seats,
    });
    return response.data;
  }

  async getMyBookings() {
    const response = await this.bookingClient.get("/bookings");
    return response.data;
  }

  async getBooking(id: string) {
    const response = await this.bookingClient.get(`/bookings/${id}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
