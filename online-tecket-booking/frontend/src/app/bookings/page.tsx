"use client";

import React from "react";
import { useQuery } from "react-query";
import { apiClient } from "@/lib/api";
import { Booking } from "@/types";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function BookingsPage() {
  const { user } = useAuth();

  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery<Booking[]>("my-bookings", apiClient.getMyBookings, {
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Please login to view your bookings.
            </p>
            <Link href="/auth/login" className="btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">
              Error loading your bookings. Please try again later.
            </p>
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
              <Link href="/bookings" className="text-primary-600 font-medium">
                My Bookings
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-primary-600"
                >
                  Admin
                </Link>
              )}
              <span className="text-gray-500">Welcome, {user.email}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="mt-2 text-gray-600">
              View and manage your event bookings
            </p>
          </div>

          {!bookings || bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't made any bookings yet. Start exploring events!
              </p>
              <Link href="/events" className="btn-primary">
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Booking #{booking._id.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Booked on{" "}
                        {new Date(booking.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Event Details
                      </h4>
                      <p className="text-gray-600">
                        Event ID: {booking.eventId}
                      </p>
                      <Link
                        href={`/events/${booking.eventId}`}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        View Event Details →
                      </Link>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Booking Summary
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Number of Seats:
                          </span>
                          <span className="font-medium">{booking.seats}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price per Seat:</span>
                          <span className="font-medium">$50</span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span className="text-gray-900 font-medium">
                            Total:
                          </span>
                          <span className="font-bold text-primary-600">
                            ${booking.seats * 50}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.status === "confirmed" && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-green-800 font-medium">
                          Booking Confirmed
                        </span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        You should receive a confirmation email shortly with
                        your ticket details.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
