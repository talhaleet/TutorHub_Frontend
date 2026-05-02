// src/pages/MyBookingsPage.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyBookings } from '../services/bookingService';
import BookingCard from '../components/booking/BookingCard';
import { Link } from 'react-router-dom';

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

  if (isLoading) {
    return (
      <div className='min-h-screen bg-neutral-50 py-8'>
        <div className='max-w-4xl mx-auto px-4'>
          <div className='text-center py-12'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
            <p className='text-neutral-500 mt-4'>Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-neutral-50 py-8'>
        <div className='max-w-4xl mx-auto px-4'>
          <div className='bg-red-50 border border-red-200 rounded-xl p-4 text-center'>
            <p className='text-red-600'>Failed to load bookings. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-neutral-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-neutral-800 mb-2'>My Bookings</h1>
          <p className='text-neutral-500'>Manage and track all your tutoring sessions</p>
        </div>

        {/* Tabs */}
        <div className='flex gap-2 mb-6 border-b border-neutral-200'>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold text-sm transition-all relative ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab}
              <span className='ml-2 px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-xs'>
                {bookings.filter(TAB_FILTER[tab]).length}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className='bg-white rounded-2xl shadow-md p-12 text-center'>
            <svg className='w-20 h-20 mx-auto text-neutral-300 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
            <h3 className='text-lg font-semibold text-neutral-700 mb-2'>No {activeTab} Bookings</h3>
            <p className='text-neutral-500 mb-4'>
              {activeTab === 'Upcoming' 
                ? "You don't have any upcoming sessions. Start by booking a tutor!" 
                : activeTab === 'Past'
                ? "You haven't completed any sessions yet."
                : "You don't have any cancelled bookings."}
            </p>
            {activeTab === 'Upcoming' && (
              <Link
                to='/search'
                className='inline-block bg-primary text-white font-semibold py-2 px-6 rounded-xl hover:bg-primary/90 transition-all'
              >
                Find a Tutor
              </Link>
            )}
          </div>
        ) : (
          <div className='space-y-4'>
            {filteredBookings.map((booking) => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                showCancelButton={activeTab === 'Upcoming'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}