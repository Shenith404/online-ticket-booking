# Event Ticket Booking - Frontend

A modern Next.js frontend application for the Event Ticket Booking microservices platform.

## Features

- **Authentication**: User registration, login, and JWT-based authentication
- **Event Management**: Browse, search, and view event details
- **Booking System**: Book tickets for events with real-time seat availability
- **Admin Panel**: Create, manage, and delete events (admin users only)
- **User Dashboard**: View and manage personal bookings
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Architecture Overview

This frontend integrates with the following microservices:

- **Auth Service** (Port 3001): User authentication and authorization
- **Event Service** (Port 3002): Event management and seat tracking
- **Booking Service** (Port 3003): Booking creation and management
- **Notification Service** (Port 3004): Email notifications (background)

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **State Management**: React Query for server state
- **Forms**: React Hook Form with validation
- **Authentication**: JWT tokens with cookies
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Hot Toast
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Running NestJS microservices (auth, event, booking services)

### Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your service URLs:

```
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_EVENT_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_BOOKING_SERVICE_URL=http://localhost:3003
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── events/            # Event listing and details
│   ├── bookings/          # User bookings dashboard
│   ├── admin/             # Admin panel
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
│   └── useAuth.tsx       # Authentication context
├── lib/                   # Utility functions
│   ├── api.ts            # API client with service integration
│   └── utils.ts          # Helper functions
└── types/                 # TypeScript type definitions
    └── index.ts          # Shared types and interfaces
```

## Key Features

### Authentication Flow

1. **Registration**: Users can create accounts with email/password
2. **Login**: JWT token authentication with automatic refresh
3. **Role-based Access**: Admin and user roles with different permissions
4. **Session Management**: Automatic logout on token expiration

### Event Management

- **Public Event Listing**: Browse all available events
- **Search and Filter**: Find events by title, description, or venue
- **Real-time Availability**: Live seat count updates
- **Event Details**: Comprehensive event information with booking form

### Booking Process

1. **Seat Selection**: Choose number of seats for an event
2. **Payment Processing**: Mock payment gateway integration
3. **Confirmation**: Real-time booking confirmation
4. **Email Notification**: Automatic email via notification service

### Admin Features

- **Event Creation**: Add new events with full details
- **Event Management**: View, edit, and delete existing events
- **Dashboard Overview**: Monitor all events and bookings

## API Integration

The frontend integrates with microservices using a centralized API client:

### Auth Service Integration

```typescript
// Login
await apiClient.login(email, password);

// Register
await apiClient.register(email, password, role);

// Validate token
await apiClient.validateToken();
```

### Event Service Integration

```typescript
// Get all events
await apiClient.getEvents();

// Get single event
await apiClient.getEvent(id);

// Create event (admin)
await apiClient.createEvent(eventData);

// Check seat availability
await apiClient.getAvailableSeats(eventId);
```

### Booking Service Integration

```typescript
// Create booking
await apiClient.createBooking(eventId, seats);

// Get user bookings
await apiClient.getMyBookings();
```

## State Management

The application uses React Query for efficient server state management:

- **Caching**: Automatic caching of API responses
- **Background Refetching**: Keep data fresh automatically
- **Optimistic Updates**: Immediate UI updates for better UX
- **Error Handling**: Centralized error handling with toast notifications

## Styling and UI

Built with Tailwind CSS for:

- **Responsive Design**: Mobile-first approach
- **Component Classes**: Reusable utility classes
- **Color Scheme**: Consistent primary/secondary color palette
- **Interactive Elements**: Hover states and transitions

## Development Guidelines

### Adding New Features

1. **Create Types**: Define TypeScript interfaces in `src/types/`
2. **API Methods**: Add service calls to `src/lib/api.ts`
3. **Components**: Build reusable components in `src/components/`
4. **Pages**: Create new pages in the `src/app/` directory

### Code Quality

- **TypeScript**: Full type safety for all components and functions
- **ESLint**: Automated code linting and formatting
- **Error Boundaries**: Graceful error handling throughout the app
- **Loading States**: Proper loading indicators for all async operations

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

For production deployment, ensure these environment variables are set:

```
NEXT_PUBLIC_AUTH_SERVICE_URL=https://your-auth-service.com
NEXT_PUBLIC_EVENT_SERVICE_URL=https://your-event-service.com
NEXT_PUBLIC_BOOKING_SERVICE_URL=https://your-booking-service.com
```

## Testing

Run the development server and test the following workflows:

1. **User Registration/Login**: Create account and sign in
2. **Event Browsing**: Browse and search events
3. **Booking Flow**: Book tickets for an event
4. **Admin Operations**: Create and manage events (admin account)
5. **Booking Management**: View and track bookings

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure microservices have CORS enabled
2. **Authentication Fails**: Verify JWT_SECRET matches across services
3. **API Connection**: Check service URLs in environment variables
4. **Build Errors**: Ensure all dependencies are installed

### Debug Mode

Enable detailed logging by setting:

```
NODE_ENV=development
```

## Contributing

1. Follow the existing code structure and naming conventions
2. Add TypeScript types for all new features
3. Include error handling for all API calls
4. Test responsive design on multiple screen sizes
5. Update documentation for new features

## License

This project is part of the Event Ticket Booking microservices platform.
