# Event Ticket Booking Platform

A complete microservices-based event ticket booking platform with NestJS backend services and Next.js frontend.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │  Microservices  │
│   (Next.js)     │◄──►│   (Optional)    │◄──►│   (NestJS)      │
│   Port: 3000    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                               │
                               ┌───────────────┼───────────────┐
                               │               │               │
                    ┌──────────▼──────────┐   │   ┌──────────▼──────────┐
                    │   Auth Service      │   │   │   Event Service     │
                    │   Port: 3001        │   │   │   Port: 3002        │
                    │   - Registration    │   │   │   - Event CRUD      │
                    │   - Login/Logout    │   │   │   - Seat Management │
                    │   - JWT Auth        │   │   │   - Admin Controls  │
                    └─────────────────────┘   │   └─────────────────────┘
                                              │
                    ┌─────────────────────┐   │   ┌─────────────────────┐
                    │  Booking Service    │   │   │ Notification Service│
                    │  Port: 3003         │   │   │  Port: 3004         │
                    │  - Create Bookings  │   │   │  - Email Alerts     │
                    │  - Payment Process  │   │   │  - RabbitMQ Consumer│
                    │  - User Bookings    │   │   │  - SendGrid API     │
                    └─────────────────────┘   │   └─────────────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │         Infrastructure              │
                    │                                     │
            ┌───────▼────────┐  ┌──────────▼───────────┐ │
            │    MongoDB     │  │      RabbitMQ        │ │
            │   Port: 27017  │  │     Port: 5672       │ │
            │   - User Data  │  │   - Message Queue    │ │
            │   - Events     │  │   - Event Publishing │ │
            │   - Bookings   │  │   - Email Triggers   │ │
            └────────────────┘  └──────────────────────┘ │
                                                         │
                              ┌──────────────────────────▼──┐
                              │         Docker             │
                              │    - Service Containers    │
                              │    - Database Containers   │
                              │    - Development Setup     │
                              └─────────────────────────────┘
```

## 🛠️ Technology Stack

### Backend (NestJS Microservices)

- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt
- **Message Queue**: RabbitMQ for inter-service communication
- **Email Service**: SendGrid for notifications
- **Validation**: class-validator and class-transformer
- **Documentation**: Auto-generated API docs

### Frontend (Next.js)

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query for server state
- **Forms**: React Hook Form with validation
- **HTTP Client**: Axios with interceptors
- **Authentication**: JWT with secure cookies
- **Notifications**: React Hot Toast

### Infrastructure

- **Database**: MongoDB (containerized)
- **Message Broker**: RabbitMQ (containerized)
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload for all services

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Clone and Setup Backend

```bash
cd services

# Start infrastructure (MongoDB, RabbitMQ)
docker-compose up -d mongodb rabbitmq

# Setup and run each service
cd auth-service
npm install
npm run start:dev

cd ../event-service
npm install
npm run start:dev

cd ../booking-service
npm install
npm run start:dev

cd ../notification-service
npm install
npm run start:dev
```

### 2. Setup Frontend

```bash
cd frontend

# Windows
setup.bat

# Linux/Mac
chmod +x setup.sh
./setup.sh

# Start frontend
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Event Service**: http://localhost:3002
- **Booking Service**: http://localhost:3003
- **MongoDB**: mongodb://localhost:27017
- **RabbitMQ Management**: http://localhost:15672 (admin/password123)

## 📋 Features

### User Features

- ✅ **Account Management**: Registration, login, profile management
- ✅ **Event Discovery**: Browse, search, and filter events
- ✅ **Ticket Booking**: Real-time seat availability and booking
- ✅ **Payment Processing**: Mock payment gateway integration
- ✅ **Booking History**: View and manage past bookings
- ✅ **Email Notifications**: Automatic booking confirmations

### Admin Features

- ✅ **Event Management**: Create, update, delete events
- ✅ **Seat Management**: Real-time seat tracking
- ✅ **User Management**: Role-based access control
- ✅ **Dashboard**: Admin overview and analytics

### Technical Features

- ✅ **Microservices Architecture**: Scalable and maintainable
- ✅ **Event-Driven Communication**: RabbitMQ message queues
- ✅ **Authentication & Authorization**: JWT-based security
- ✅ **Database Design**: Optimized MongoDB schemas
- ✅ **API Documentation**: Auto-generated documentation
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Logging**: Structured logging across services
- ✅ **Containerization**: Docker support for deployment

## 🔧 Service Configuration

### Environment Variables

Each service requires specific environment variables:

#### Auth Service (.env)

```
DB_URI=mongodb://admin:password123@localhost:27017/auth-db?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
PORT=3001
```

#### Event Service (.env)

```
DB_URI=mongodb://admin:password123@localhost:27017/event-db?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-here
AUTH_SERVICE_URL=http://localhost:3001
PORT=3002
```

#### Booking Service (.env)

```
DB_URI=mongodb://admin:password123@localhost:27017/booking-db?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-here
EVENT_SERVICE_URL=http://localhost:3002
RABBITMQ_URI=amqp://admin:password123@localhost:5672
PORT=3003
```

#### Notification Service (.env)

```
SENDGRID_API_KEY=your-sendgrid-api-key-here
FROM_EMAIL=noreply@yourdomain.com
RABBITMQ_URI=amqp://admin:password123@localhost:5672
PORT=3004
```

## 📚 API Documentation

### Auth Service Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `GET /auth/validate` - Validate JWT token

### Event Service Endpoints

- `GET /events` - List all events
- `GET /events/:id` - Get event details
- `POST /events` - Create event (admin)
- `PATCH /events/:id` - Update event (admin)
- `DELETE /events/:id` - Delete event (admin)
- `GET /events/:id/available-seats` - Check seat availability

### Booking Service Endpoints

- `POST /bookings` - Create booking
- `GET /bookings` - Get user bookings
- `GET /bookings/:id` - Get booking details

## 🧪 Testing

### Manual Testing Workflow

1. **User Registration**
   - Create user account with email/password
   - Verify JWT token generation

2. **Admin Account**
   - Register admin user (role: 'admin')
   - Access admin panel features

3. **Event Management**
   - Create events (admin only)
   - View event listings (public)
   - Check seat availability

4. **Booking Process**
   - Select event and seat count
   - Process mock payment
   - Verify booking creation
   - Check email notification

5. **Data Persistence**
   - Verify data storage in MongoDB
   - Check message publishing to RabbitMQ

## 🐳 Docker Deployment

### Full Stack Deployment

```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Development with Docker

```bash
# Infrastructure only
docker-compose -f docker-compose.override.yml up -d

# This runs only MongoDB and RabbitMQ
# Run services manually for development
```

## 🔍 Monitoring & Debugging

### Log Locations

- **Service Logs**: Console output with structured logging
- **MongoDB Logs**: Docker container logs
- **RabbitMQ Logs**: Docker container logs
- **Frontend Logs**: Browser console and terminal

### Debug Tools

- **MongoDB Compass**: GUI for database inspection
- **RabbitMQ Management**: Web UI for queue monitoring
- **Browser DevTools**: Network tab for API inspection
- **VS Code**: Integrated debugging for Node.js services

## 🚢 Production Deployment

### Checklist

- [ ] Update JWT secrets to secure values
- [ ] Configure SendGrid API key for email
- [ ] Set up production MongoDB cluster
- [ ] Configure production RabbitMQ instance
- [ ] Set up SSL certificates
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies

### Environment Considerations

- Use environment-specific configuration files
- Implement health checks for all services
- Set up load balancing for horizontal scaling
- Configure Redis for session storage (optional)
- Implement API rate limiting
- Set up CI/CD pipelines

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Follow the existing code style and conventions
4. Add tests for new functionality
5. Update documentation as needed
6. Submit pull request with detailed description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:

1. Check the troubleshooting sections in service READMEs
2. Review Docker logs for service errors
3. Verify environment variable configuration
4. Check service connectivity and ports

## 🔮 Future Enhancements

- [ ] **Payment Gateway**: Real payment processing (Stripe/PayPal)
- [ ] **Search Enhancement**: Elasticsearch integration
- [ ] **Real-time Updates**: WebSocket for live seat updates
- [ ] **Mobile App**: React Native companion app
- [ ] **Analytics**: User behavior tracking and reporting
- [ ] **Multi-tenancy**: Support for multiple event organizers
- [ ] **Advanced Notifications**: SMS, push notifications
- [ ] **API Gateway**: Centralized routing and rate limiting
- [ ] **Caching**: Redis for improved performance
- [ ] **File Upload**: Event images and attachments
