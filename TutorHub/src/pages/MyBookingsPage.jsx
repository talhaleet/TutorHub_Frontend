import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyBookings } from '../services/bookingService';
import BookingCard from '../components/booking/BookingCard';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardShell from '../components/layout/DashboardShell';

const TABS = ['Upcoming', 'Past', 'Cancelled'];
const TAB_FILTER = {
  Upcoming: (b) => b.status === 'Confirmed' || b.status === 'Pending',
  Past: (b) => b.status === 'Completed',
  Cancelled: (b) => b.status === 'Cancelled',
};

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const { data, isLoading, error } = useQuery({
    queryKey: ['myBookings'],
    queryFn: getMyBookings,
  });

  const bookings = data?.data || [];
  const filteredBookings = bookings.filter(TAB_FILTER[activeTab]);

  const content = () => {
    if (isLoading) {
      return (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-slate-500 mt-4 text-sm">Loading your bookings...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 text-sm">Failed to load bookings. Please try again.</p>
        </div>
      );
    }

    if (filteredBookings.length === 0) {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No {activeTab} Bookings</h3>
          <p className="text-slate-500 text-sm mb-4 max-w-sm mx-auto">
            {activeTab === 'Upcoming'
              ? "You don't have any upcoming sessions. Start by booking a tutor!"
              : activeTab === 'Past'
              ? "You haven't completed any sessions yet."
              : "You don't have any cancelled bookings."}
          </p>
          {activeTab === 'Upcoming' && (
            <Link
              to="/search"
              className="inline-block bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-colors text-sm"
            >
              Find a Tutor
            </Link>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            showCancelButton={activeTab === 'Upcoming'}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <DashboardShell className="max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
            <p className="text-slate-500 text-sm">Manage and track all your tutoring sessions</p>
          </div>
          <Link
            to="/search"
            className="inline-flex justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors shadow-sm whitespace-nowrap"
          >
            Book New Session
          </Link>
        </div>

        <div className="settings-tabs-scroll border-b border-slate-200 mb-6 gap-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-3 font-semibold text-sm transition-all relative shrink-0 ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
              <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">
                {bookings.filter(TAB_FILTER[tab]).length}
              </span>
            </button>
          ))}
        </div>

        {content()}
      </DashboardShell>
    </DashboardLayout>
  );
}
