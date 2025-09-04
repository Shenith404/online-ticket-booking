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
- **API Documentation**: Auto-generated Swagger documentation

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │  Microservices  │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (NestJS)      │
│   Port: 3000    │    │   Port: 3005    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                              │
                      ┌───────────────────────┼───────────────────────┐
                      │                       │                       │
           ┌──────────▼──────────┐   ┌───────▼────────┐   ┌──────────▼──────────┐
           │   Auth Service      │   │   Event Service │   │  Booking Service    │
           │   Port: 3001        │   │   Port: 3002    │   │   Port: 3003        │
           │   - JWT Auth        │   │   - Event CRUD  │   │   - Create Bookings │
           │   - User Management │   │   - Seat Mgmt   │   │   - Payment Process │
           └─────────────────────┘   └─────────────────┘   └─────────────────────┘
                                              │
                                    ┌─────────▼─────────┐
                                    │ Notification Svc  │
                                    │   Port: 3004      │
                                    │   - Email Alerts  │
                                    │   - RabbitMQ      │
                                    └───────────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │         Infrastructure              │
            ┌───────▼────────┐  ┌──────────▼───────────┐ │
            │    MongoDB     │  │      RabbitMQ        │ │
            │   Port: 27017  │  │     Port: 5672       │ │
            │   - User Data  │  │   - Message Queue    │ │
            │   - Events     │  │   - Event Publishing │ │
            │   - Bookings   │  │   - Email Triggers   │ │
            └────────────────┘  └──────────────────────┘ │
                                                         │
                              ┌──────────────────────────▼──┐
                              │    Docker & Kubernetes     │
                              └─────────────────────────────┘
```

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

#### Start Infrastructure

```bash
# Start MongoDB and RabbitMQ
docker run -d --name mongodb -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:latest

docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=password123 \
  rabbitmq:3-management
```

#### Start Services

```bash
# Terminal 1: Auth Service
cd services/auth-service
npm install
npm run start:dev

# Terminal 2: Event Service
cd services/event-service
npm install
npm run start:dev

# Terminal 3: Booking Service
cd services/booking-service
npm install
npm run start:dev

# Terminal 4: Notification Service
cd services/notification-service
npm install
npm run start:dev

# Terminal 5: Gateway
cd services/gateway
npm install
npm run start:dev

# Terminal 6: Frontend
cd frontend
npm install
npm run dev
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

### Direct Service Access (Development)

#### Auth Service (Port: 3001)

- Swagger docs: http://localhost:3001/api

#### Event Service (Port: 3002)

- Swagger docs: http://localhost:3002/api

#### Booking Service (Port: 3003)

- Swagger docs: http://localhost:3003/api

## 🧪 Testing

### Manual Testing Workflow

1. **User Registration**
   - Visit http://localhost:3000/auth/register
   - Create user account with email/password
   - Verify JWT token generation and storage

2. **Admin Account Setup**
   - Register with role: 'admin'
   - Access admin-only features at /admin

3. **Event Management**
   - Create events (admin only)
   - Browse events (public access)
   - Check real-time seat availability

4. **Booking Process**
   - Select event and seat count
   - Process mock payment
   - Verify booking creation and email notification

### Running Tests

```bash
# Run tests for individual services
cd services/auth-service && npm run test
cd services/event-service && npm run test
cd services/booking-service && npm run test
cd services/gateway && npm run test

# Run frontend tests
cd frontend && npm run test
```

## 🐛 Troubleshooting

### Common Issues

#### Service Connection Problems

- **Issue**: Services can't connect to MongoDB
- **Solution**: Verify MongoDB is running and connection strings are correct

#### Authentication Errors

- **Issue**: JWT tokens not working across services
- **Solution**: Ensure all services use the same `JWT_SECRET`

#### Port Conflicts

- **Issue**: Services fail to start due to port conflicts
- **Solution**: Check if ports 3001-3005, 27017, 5672 are available

#### Docker Build Failures

- **Issue**: Docker images fail to build
- **Solution**: Ensure Dockerfiles are present and Node.js dependencies are installed

### Kubernetes Troubleshooting

```bash
# Check pod status
kubectl get pods -n ticket-booking

# View pod logs
kubectl logs -f deployment/auth-deployment -n ticket-booking

# Check service connectivity
kubectl get services -n ticket-booking

# Verify ConfigMaps
kubectl get configmaps -n ticket-booking
```

### minikube Issues

```bash
# Check minikube status
minikube status

# Restart minikube
minikube stop && minikube start

# Enable required addons
minikube addons enable ingress
```

## 🔄 Development Workflow

### Adding New Features

1. **Plan the Change**: Identify which service(s) need modification
2. **Update Types**: Add/modify TypeScript interfaces
3. **Implement Backend**: Add controllers, services, DTOs
4. **Update Frontend**: Add UI components and API integration
5. **Test Integration**: Verify end-to-end functionality
6. **Update Documentation**: Keep README and API docs current

### Code Quality Standards

- **TypeScript**: Full type safety across all services
- **ESLint**: Consistent code formatting
- **Error Handling**: Comprehensive error management
- **Logging**: Structured logging for debugging
- **Validation**: Input validation using class-validator

## 🚢 Production Deployment

### Environment Preparation

1. **Configure Production Secrets**
   - Use Kubernetes Secrets for sensitive data
   - Set up production MongoDB cluster
   - Configure production Mailtrap account

2. **Update Image Registry**
   - Build and push images to production registry
   - Update Kubernetes manifests with production image tags

3. **Infrastructure Setup**
   - Set up production Kubernetes cluster
   - Configure persistent storage for MongoDB
   - Set up monitoring and logging

### Deployment Commands

```bash
# Apply production configurations
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmaps/
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
kubectl apply -f k8s/ingress/

# Monitor deployment
kubectl rollout status deployment/auth-deployment -n ticket-booking
kubectl rollout status deployment/event-deployment -n ticket-booking
kubectl rollout status deployment/booking-deployment -n ticket-booking
kubectl rollout status deployment/frontend-deployment -n ticket-booking
kubectl rollout status deployment/gateway-deployment -n ticket-booking
kubectl rollout status deployment/notification-deployment -n ticket-booking
```

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Contribution Guidelines

- Follow existing code style and conventions
- Add tests for new features
- Update documentation for any API changes
- Ensure all services start and communicate correctly
- Test both local and Kubernetes deployments

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or support:

- **GitHub Issues**: [Create an issue](https://github.com/Shenith404/online-ticket-booking/issues)
- **Documentation**: Check this README and service-specific documentation
- **Email**: Contact the maintainer for urgent issues

## Future Enhancements

- [ ] Real payment gateway integration (Stripe/PayPal)
- [ ] Advanced event search and filtering
- [ ] Mobile app development (React Native)
- [ ] Real-time seat booking with WebSockets
- [ ] Analytics dashboard for admins
- [ ] Multi-language support
- [ ] Social media integration
- [ ] Event recommendation system
- [ ] PDF ticket generation
- [ ] Advanced monitoring and alerting

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)
- [Node.js (v18+ recommended)](https://nodejs.org/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [minikube](https://minikube.sigs.k8s.io/docs/)
- (Optional) [Postman](https://www.postman.com/) for API testing

## Folder Structure

```
online-tecket-booking/
  frontend/                # Next.js frontend
  services/
    auth-service/          # Auth microservice (NestJS)
    booking-service/       # Booking microservice (NestJS)
    event-service/         # Event microservice (NestJS)
    notification-service/  # Notification microservice (NestJS)
    gateway/               # API Gateway (NestJS)
  k8s/                     # Kubernetes manifests
    configmaps/
    deployments/
    ingress/
    services/
    namespace.yaml
```

---

## Microservices Overview

- **auth-service**: Handles user registration, login, authentication, and JWT token management.
- **booking-service**: Manages ticket bookings, payments, and booking history.
- **event-service**: Manages events, event details, and event listings.
- **notification-service**: Sends email notifications (e.g., booking confirmations).
- **gateway**: API gateway that routes requests to the appropriate backend service.
- **frontend**: Next.js app for the user interface.

---

## Environment Variables & Configuration

Each service uses environment variables, most of which are set via Kubernetes ConfigMaps. For local development, copy the example `.env` files (if present) in each service and fill in your values:

```sh
cp .env.example .env
# Edit .env as needed
```

Common variables:

- MongoDB URIs
- JWT secrets and expiry
- Service ports
- RabbitMQ/Mailtrap credentials (for notifications)

See `k8s/configmaps/` for all config values used in Kubernetes.

---

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

## Running Tests

Each service has its own tests (Jest for NestJS, etc):

```sh
cd services/auth-service
npm run test
# Repeat for other services
```

---

## API Documentation

- Each NestJS service exposes Swagger docs at `/api` (e.g., `http://localhost:3001/api` for auth-service when running locally).
- The gateway aggregates all backend APIs.
- See the `frontend/` directory for UI routes and usage.

---

## Contact & Support

For questions, issues, or feature requests, please open an issue on this repository or contact the maintainer directly.

---

## 1. Clone the Repository

```sh
git clone https://github.com/your-username/online-ticket-booking.git
cd online-ticket-booking
```

---

## 2. Build and Push Docker Images

Make sure you are logged in to Docker Hub and update the image names in your Kubernetes manifests if needed.

```sh
# Example for each service (repeat for all)
cd services/auth-service
docker build -t your-dockerhub-username/auth-service:latest .
docker push your-dockerhub-username/auth-service:latest

# Do the same for booking-service, event-service, notification-service, gateway, and frontend
```

---

## 3. Start minikube

```sh
minikube start
```

Enable the ingress addon (only once):

```sh
minikube addons enable ingress
```

---

## 4. Apply Kubernetes Manifests

```sh
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmaps/ -R
kubectl apply -f k8s/deployments/ -R
kubectl apply -f k8s/services/ -R
kubectl apply -f k8s/ingress/ -R
```

---

## 5. Access the Application

### Option 1: Port Forwarding (Quickest for Local Dev)

Open two terminals and run:

```sh
kubectl port-forward -n ticket-booking service/frontend-service 3000:3000
kubectl port-forward -n ticket-booking service/gateway-service 3005:3005
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Gateway API: [http://localhost:3005](http://localhost:3005)

### Option 2: Ingress (Recommended for full-stack testing)

Start the minikube tunnel in a separate terminal:

```sh
minikube tunnel
```

Add this line to your `hosts` file:

```
127.0.0.1 ticket.local
```

Now visit: [http://ticket.local](http://ticket.local)

---

## 6. Troubleshooting

- If you can't access via `ticket.local`, make sure the tunnel is running and your hosts file is updated.
- For Windows users, always run your terminal as Administrator for `minikube tunnel`.

---

## 7. Stopping Everything

To stop minikube and free resources:

```sh
minikube stop
```

---

## 8. Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 9. License

[MIT](LICENSE)

---
