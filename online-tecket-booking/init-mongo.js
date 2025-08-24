// MongoDB initialization script
db = db.getSiblingDB("ticket_booking");

// Create collections
db.createCollection("users");
db.createCollection("events");
db.createCollection("bookings");
db.createCollection("notifications");

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.events.createIndex({ title: "text", description: "text" });
db.events.createIndex({ date: 1 });
db.events.createIndex({ location: 1 });
db.bookings.createIndex({ userId: 1 });
db.bookings.createIndex({ eventId: 1 });
db.bookings.createIndex({ bookingDate: 1 });
db.notifications.createIndex({ userId: 1 });
db.notifications.createIndex({ createdAt: 1 });

print("Database initialized successfully");
