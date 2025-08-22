import axios, { AxiosInstance, AxiosError } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

class ApiClient {
  private authClient: AxiosInstance;
  private eventClient: AxiosInstance;
  private bookingClient: AxiosInstance;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api';

    // Auth Service Client
    this.authClient = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Event Service Client
    this.eventClient = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Booking Service Client
    this.bookingClient = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Add request interceptors to include auth token
    [this.authClient, this.eventClient, this.bookingClient].forEach(
      (client) => {
        client.interceptors.request.use(
          (config) => {
            // Don't check token for login and register endpoints
            const isAuthEndpoint = config.url?.includes('/auth/login') || 
                                 config.url?.includes('/auth/register');
            
            if (!isAuthEndpoint) {
              const token = Cookies.get("access_token");
              if (!token) {
                // Clear user data if token is missing
                Cookies.remove("user");
                return Promise.reject(new Error("No auth token"));
              }
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
            // Don't redirect for login/register endpoints
            const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                                 error.config?.url?.includes('/auth/register');

            if (error.response?.status === 401 && !isAuthEndpoint) {
              // Clear auth state
              Cookies.remove("access_token");
              Cookies.remove("user");
              
              // Show error message
              toast.error("Session expired. Please login again.");
              
              // Delay redirect slightly to ensure toast is visible
              setTimeout(() => {
                window.location.href = "/auth/login";
              }, 100);
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
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await this.authClient.get("/auth/validate");
      return response.data;
    } catch (error) {
      // If token validation fails, clear auth state
      Cookies.remove("access_token");
      Cookies.remove("user");
      throw error;
    }
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
  }  async deleteEvent(id: string) {
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
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Convert seats to number directly without parseInt
      const response = await this.bookingClient.post("/bookings", 
        {
          eventId,
          seats: Number(seats)
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating booking:", error?.response?.data || error);
      throw error;
    }
  }

  async getMyBookings() {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await this.bookingClient.get("/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching bookings:", error?.response?.data || error);
      throw error;
    }
  }

  async getBooking(id: string) {
    const response = await this.bookingClient.get(`/bookings/${id}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
