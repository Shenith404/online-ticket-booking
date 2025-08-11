"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { apiClient } from "@/lib/api";
import { Event } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import toast from "react-hot-toast";

interface BookingFormData {
  seats: number;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const eventId = params.id as string;

  const {
    data: event,
    isLoading,
    error,
  } = useQuery<Event>(["event", eventId], () => apiClient.getEvent(eventId));

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      seats: 1,
    },
  });

  const watchSeats = watch("seats");

  const bookingMutation = useMutation(
    (data: { eventId: string; seats: number }) =>
      apiClient.createBooking(data.eventId, data.seats),
    {
      onSuccess: () => {
        toast.success("Booking created successfully!");
        queryClient.invalidateQueries(["event", eventId]);
        router.push("/bookings");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Booking failed");
      },
    }
  );

  const onSubmit = (data: BookingFormData) => {
    bookingMutation.mutate({ eventId, seats: data.seats });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading event details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">
              Event not found or error loading event details.
            </p>
            <Link href="/events" className="btn-primary mt-4 inline-block">
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isEventExpired = new Date(event.date) < new Date();
  const isSoldOut = event.availableSeats === 0;

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
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Event Header */}
            <div className="px-6 py-8 border-b">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{event.venue}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>
                      {event.availableSeats} / {event.totalSeats} seats
                      available
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-3xl font-bold text-primary-600">
                    $50 per seat
                  </div>

                  {isEventExpired && (
                    <div className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                      Event Expired
                    </div>
                  )}

                  {isSoldOut && !isEventExpired && (
                    <div className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                      Sold Out
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="px-6 py-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About This Event
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Booking Form */}
            {user && !isEventExpired && !isSoldOut && (
              <div className="px-6 py-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Book Your Tickets
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label
                      htmlFor="seats"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Number of Seats
                    </label>
                    <input
                      {...register("seats", {
                        required: "Number of seats is required",
                        min: {
                          value: 1,
                          message: "Minimum 1 seat required",
                        },
                        max: {
                          value: event.availableSeats,
                          message: `Maximum ${event.availableSeats} seats available`,
                        },
                      })}
                      type="number"
                      min="1"
                      max={event.availableSeats}
                      className="input max-w-xs"
                    />
                    {errors.seats && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.seats.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total Cost:</span>
                      <span className="text-2xl font-bold text-primary-600">
                        ${(watchSeats || 1) * 50}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingMutation.isLoading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingMutation.isLoading ? "Processing..." : "Book Now"}
                  </button>
                </form>
              </div>
            )}

            {/* Login Prompt */}
            {!user && !isEventExpired && !isSoldOut && (
              <div className="px-6 py-6 bg-gray-50">
                <p className="text-gray-600 mb-4">
                  Please login to book tickets for this event.
                </p>
                <Link href="/auth/login" className="btn-primary">
                  Login to Book
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
