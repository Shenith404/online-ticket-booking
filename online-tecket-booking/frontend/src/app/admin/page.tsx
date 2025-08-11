"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { apiClient } from "@/lib/api";
import { Event, CreateEventRequest } from "@/types";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function AdminPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    data: events,
    isLoading,
    error,
  } = useQuery<Event[]>("admin-events", apiClient.getEvents);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEventRequest>();

  const createEventMutation = useMutation(
    (eventData: CreateEventRequest) => apiClient.createEvent(eventData),
    {
      onSuccess: () => {
        toast.success("Event created successfully!");
        queryClient.invalidateQueries("admin-events");
        reset();
        setShowCreateForm(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to create event");
      },
    }
  );

  const deleteEventMutation = useMutation(
    (eventId: string) => apiClient.deleteEvent(eventId),
    {
      onSuccess: () => {
        toast.success("Event deleted successfully!");
        queryClient.invalidateQueries("admin-events");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to delete event");
      },
    }
  );

  const onSubmit = (data: CreateEventRequest) => {
    createEventMutation.mutate(data);
  };

  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      deleteEventMutation.mutate(eventId);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Access denied. Admin privileges required.
            </p>
            <Link href="/" className="btn-primary">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading admin panel...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">
                Event Booking
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/events"
                className="text-gray-700 hover:text-primary-600"
              >
                Events
              </Link>
              <Link
                href="/bookings"
                className="text-gray-700 hover:text-primary-600"
              >
                My Bookings
              </Link>
              <Link href="/admin" className="text-primary-600 font-medium">
                Admin
              </Link>
              <span className="text-gray-500">Welcome, {user.email}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">Manage events and bookings</p>
          </div>

          {/* Create Event Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Events Management
                </h2>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="btn-primary"
                >
                  {showCreateForm ? "Cancel" : "Create New Event"}
                </button>
              </div>
            </div>

            {showCreateForm && (
              <div className="px-6 py-6 border-b border-gray-200">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Event Title
                      </label>
                      <input
                        {...register("title", {
                          required: "Title is required",
                        })}
                        type="text"
                        className="input"
                        placeholder="Enter event title"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="venue"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Venue
                      </label>
                      <input
                        {...register("venue", {
                          required: "Venue is required",
                        })}
                        type="text"
                        className="input"
                        placeholder="Enter venue"
                      />
                      {errors.venue && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.venue.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                      })}
                      rows={3}
                      className="input"
                      placeholder="Enter event description"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Event Date & Time
                      </label>
                      <input
                        {...register("date", { required: "Date is required" })}
                        type="datetime-local"
                        className="input"
                      />
                      {errors.date && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.date.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="totalSeats"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Total Seats
                      </label>
                      <input
                        {...register("totalSeats", {
                          required: "Total seats is required",
                          min: { value: 1, message: "Minimum 1 seat required" },
                        })}
                        type="number"
                        min="1"
                        className="input"
                        placeholder="Enter total seats"
                      />
                      {errors.totalSeats && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.totalSeats.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={createEventMutation.isLoading}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createEventMutation.isLoading
                        ? "Creating..."
                        : "Create Event"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Events List */}
            <div className="px-6 py-6">
              {error ? (
                <p className="text-red-600">
                  Error loading events. Please try again later.
                </p>
              ) : !events || events.length === 0 ? (
                <p className="text-gray-500">No events found.</p>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {event.description}
                          </p>
                          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-500">
                            <div>
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(event.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                            <div>
                              <span className="font-medium">Venue:</span>{" "}
                              {event.venue}
                            </div>
                            <div>
                              <span className="font-medium">Seats:</span>{" "}
                              {event.availableSeats} / {event.totalSeats}{" "}
                              available
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Link
                            href={`/events/${event._id}`}
                            className="btn-secondary text-sm"
                          >
                            View
                          </Link>
                          <button
                            onClick={() =>
                              handleDeleteEvent(event._id, event.title)
                            }
                            disabled={deleteEventMutation.isLoading}
                            className="btn-danger text-sm disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
