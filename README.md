# Event Ticket Booking Platform – Microservices Architecture

A complete event ticket booking platform built with microservices architecture. Users can browse events, book tickets, and receive notifications, while administrators can manage events and track bookings in real-time.

## 🎯 Features

### User Features

- **Account Management**: Registration, login with JWT authentication
- **Event Discovery**: Browse, search, and view detailed event information
- **Ticket Booking**: Real-time seat availability and secure booking process
- **Booking History**: View and manage personal booking history
- **Email Notifications**: Automatic booking confirmations via Mailtrap

### Admin Features

- **Event Management**: Create, update, and delete events with full details
- **Dashboard**: Monitor events, bookings, and user activity
- **Role-based Access**: Secure admin-only operations

### Technical Features

- **Microservices Architecture**: Scalable and maintainable service separation
- **Event-Driven Communication**: RabbitMQ for inter-service messaging
- **Real-time Updates**: Live seat availability tracking
- **Container Support**: Full Docker and Kubernetes deployment




## Technology Stack

### Backend (Microservices)

- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt hashing
- **Message Queue**: RabbitMQ for inter-service communication
- **Email Service**: Mailtrap for notifications
- **Validation**: class-validator and class-transformer

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Forms**: React Hook Form with validation
- **HTTP Client**: Axios with interceptors
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes (minikube for local development)
- **Database**: MongoDB
- **Message Broker**: RabbitMQ
- **Reverse Proxy**: Nginx Ingress Controller

## Project Structure

```
online-ticket-booking/
├── frontend/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── auth/           # Authentication pages
│   │   │   ├── events/         # Event browsing and details
│   │   │   ├── bookings/       # Booking management
│   │   │   └── admin/          # Admin dashboard
│   │   ├── components/         # Reusable React components
│   │   ├── lib/               # API client and utilities
│   │   ├── hooks/             # Custom React hooks
│   │   └── types/             # TypeScript type definitions
│   └── package.json
├── services/
│   ├── auth-service/          # Authentication microservice
│   │   ├── src/
│   │   │   ├── auth/          # Auth controllers, services, DTOs
│   │   │   └── main.ts        # Service entry point (Port: 3001)
│   │   └── Dockerfile
│   ├── event-service/         # Event management microservice
│   │   ├── src/
│   │   │   ├── event/         # Event CRUD operations
│   │   │   └── main.ts        # Service entry point (Port: 3002)
│   │   └── Dockerfile
│   ├── booking-service/       # Booking processing microservice
│   │   ├── src/
│   │   │   ├── booking/       # Booking logic and payment
│   │   │   ├── payment/       # Payment processing
│   │   │   └── main.ts        # Service entry point (Port: 3003)
│   │   └── Dockerfile
│   ├── notification-service/  # Email notification microservice
│   │   ├── src/
│   │   │   ├── notification/  # Email service with Mailtrap
│   │   │   └── main.ts        # RabbitMQ consumer (Port: 3004)
│   │   └── Dockerfile
│   └── gateway/               # API Gateway service
│       ├── src/
│       │   ├── modules/       # Route modules (auth, events, bookings)
│       │   └── main.ts        # Gateway entry point (Port: 3005)
│       └── Dockerfile
├── k8s/                       # Kubernetes deployment manifests
│   ├── namespace.yaml
│   ├── configmaps/           # Environment configuration
│   ├── deployments/          # Service deployments
│   ├── services/             # Kubernetes services
│   └── ingress/              # Ingress configuration
├── docker-compose.yml        # Local development with Docker
└── README.md
```

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker](https://www.docker.com/products/docker-desktop) & Docker Compose
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [minikube](https://minikube.sigs.k8s.io/docs/) for local Kubernetes
- [Git](https://git-scm.com/)

### 1. Clone Repository

```bash
git clone https://github.com/Shenith404/online-ticket-booking.git
cd online-ticket-booking
```

### 2. Option A: Docker Compose

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

**Access Points:**

- Frontend: http://localhost:3000
- API Gateway: http://localhost:3005
- Auth Service: http://localhost:3001
- Event Service: http://localhost:3002
- Booking Service: http://localhost:3003
- Notification Service: http://localhost:3004

### 2. Option B: Kubernetes with Minikube

#### Start Minikube

```bash
minikube start
minikube addons enable ingress
```

#### Build and Push Docker Images

```bash
# Build images (update with your Docker Hub username)
docker build -t shenithbandara/auth-service:latest ./services/auth-service
docker build -t shenithbandara/event-service:latest ./services/event-service
docker build -t shenithbandara/booking-service:latest ./services/booking-service
docker build -t shenithbandara/notification-service:latest ./services/notification-service
docker build -t shenithbandara/gateway:latest ./services/gateway
docker build -t shenithbandara/frontend:latest ./frontend

# Push to registry
docker push shenithbandara/auth-service:latest
docker push shenithbandara/event-service:latest
docker push shenithbandara/booking-service:latest
docker push shenithbandara/notification-service:latest
docker push shenithbandara/gateway:latest
docker push shenithbandara/frontend:latest
```

#### Deploy to Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmaps/ -R
kubectl apply -f k8s/deployments/ -R
kubectl apply -f k8s/services/ -R
kubectl apply -f k8s/ingress/ -R

# Check deployment status
kubectl get pods -n ticket-booking
```

#### Access Applications

```bash
# Option 1: Port Forwarding (Recommended)
kubectl port-forward -n ticket-booking service/frontend-service 3000:3000 &
kubectl port-forward -n ticket-booking service/gateway-service 3005:3005 &

# Option 2: Minikube Tunnel
minikube tunnel
# Add to hosts file: 127.0.0.1:3000 ticket.local
# Access: http://ticket.local
```



## Environment Configuration

### MongoDB Connection Strings

Each service uses separate databases:

```
AUTH_DB_URI=mongodb://admin:password123@localhost:27017/auth-db?authSource=admin
EVENT_DB_URI=mongodb://admin:password123@localhost:27017/event-db?authSource=admin
BOOKING_DB_URI=mongodb://admin:password123@localhost:27017/booking-db?authSource=admin
```

### JWT Configuration

All services must use the same JWT secret:

```
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

### RabbitMQ Configuration

```
RABBITMQ_URI=amqp://admin:password123@localhost:5672
```

### Mailtrap Email Configuration

```
NOTIFICATION_MAILTRAP_TOKEN=your-mailtrap-api-token
NOTIFICATION_MAILTRAP_ACCOUNT_ID=your-account-id
NOTIFICATION_FROM_EMAIL=noreply@yourdomain.com
```

## API Documentation

### Gateway Endpoints (Port: 3005)

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/validate` - Validate JWT token

#### Events

- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin only)
- `PATCH /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)
- `GET /api/events/:id/available-seats` - Check seat availability

#### Bookings

- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details




## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.




## Running Locally Without Kubernetes

You can run each service individually for development:

```sh
# Example for auth-service
cd services/auth-service
npm install
npm run start:dev

# Do the same for other services and frontend (use `npm run dev` for Next.js)
```

You’ll need local MongoDB and RabbitMQ instances, or use cloud URIs in your `.env` files.

---



