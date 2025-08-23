@echo off
echo Starting all microservices...

start "Auth Service" cmd /k "cd services\auth-service && npm run start:dev"
timeout /t 3 /nobreak

start "Event Service" cmd /k "cd services\event-service && npm run start:dev"  
timeout /t 3 /nobreak

start "Booking Service" cmd /k "cd services\booking-service && npm run start:dev"
timeout /t 3 /nobreak

start "Notification Service" cmd /k "cd services\notification-service && npm run start:dev"
timeout /t 3 /nobreak

start "Gateway" cmd /k "cd services\gateway && npm run start:dev"

echo All services are starting...
echo Gateway: http://localhost:3005
echo Auth Service: http://localhost:3001
echo Event Service: http://localhost:3002  
echo Booking Service: http://localhost:3003
echo Notification Service: http://localhost:3004
