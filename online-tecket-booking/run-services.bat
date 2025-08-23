@echo off
echo Creating Docker network...
docker network create event-booking-network 2>nul

echo Starting MongoDB...
docker run -d --name mongodb --network event-booking-network -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password123 mongo:6

echo Starting Auth Service...
docker run -d --name auth-service --network event-booking-network -p 3001:3001 --env-file ./services/auth-service/.env.docker auth-service

echo Starting Event Service...
docker run -d --name event-service --network event-booking-network -p 3002:3002 --env-file ./services/event-service/.env.docker event-service

echo Starting Booking Service...
docker run -d --name booking-service --network event-booking-network -p 3003:3003 --env-file ./services/booking-service/.env.docker booking-service

echo Starting Notification Service...
docker run -d --name notification-service --network event-booking-network -p 3004:3004 --env-file ./services/notification-service/.env.docker notification-service

echo Starting Gateway...
docker run -d --name gateway --network event-booking-network -p 3005:3005 --env-file ./services/gateway/.env.docker gateway

echo All services started!
echo Gateway: http://localhost:3005
echo Auth Service: http://localhost:3001  
echo Event Service: http://localhost:3002
echo Booking Service: http://localhost:3003
echo Notification Service: http://localhost:3004
