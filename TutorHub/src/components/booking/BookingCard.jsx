// src/components/bookings/BookingCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingStatusBadge from './BookingStatusBadge';
import CancelBookingModal from './CancelBookingModal';
import ReviewBookingModal from './ReviewBookingModal';

export default function BookingCard({ booking, showCancelButton = true }) {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const {
    id,
    tutorName,
    tutorId,
    subjectName,
    subject,
    scheduledDate,
    startTime,
    durationMinutes,
    teachingMode,
    status,
    totalAmount,
    studentNotes,
    meetingLink
  } = booking;

  const canCancel = status === 'Pending' || status === 'Confirmed';
  const canJoin = status === 'Confirmed' && teachingMode === 'Online' && meetingLink;
  const canReschedule = (status === 'Pending' || status === 'Confirmed') && !!tutorId;
  const canReview = status === 'Completed' && !!tutorId;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleJoinSession = () => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    }
  };

  const handleReschedule = () => {
    navigate(`/book/${tutorId}?rescheduleOf=${id}`);
  };

  return (
    <>
      <div className='bg-white rounded-2xl shadow-md border border-neutral-100 hover:shadow-lg transition-all duration-300 overflow-hidden'>
        {/* Header */}
        <div className='p-5 border-b border-neutral-100'>
          <div className='flex justify-between items-start mb-3'>
            <div>
              <h3 className='text-lg font-bold text-neutral-800 mb-1'>
                {subjectName || subject || 'Session'}
              </h3>
              <p className='text-sm text-neutral-600'>
                with {tutorName}
              </p>
            </div>
            <BookingStatusBadge status={status} />
          </div>
          
          {/* Session Details Grid */}
          <div className='grid grid-cols-2 gap-3 text-sm mt-3'>
            <div className='flex items-center gap-2 text-neutral-600'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
              <span>{formatDate(scheduledDate)}</span>
            </div>
            <div className='flex items-center gap-2 text-neutral-600'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <span>{startTime} ({durationMinutes} min)</span>
            </div>
            <div className='flex items-center gap-2 text-neutral-600'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <span>{teachingMode === 'Online' ? '🌐 Online' : '🏠 In-Person'}</span>
            </div>
            <div className='flex items-center gap-2 text-neutral-600'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <span>PKR {totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Notes Section (if exists) */}
        {studentNotes && (
          <div className='px-5 py-3 bg-neutral-50 border-b border-neutral-100'>
            <p className='text-xs text-neutral-500'>
              <span className='font-semibold'>📝 Notes:</span> {studentNotes}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className='px-5 py-4 flex flex-wrap gap-2'>
          {canJoin && (
            <button
              onClick={handleJoinSession}
              className='flex-1 bg-green-600 text-white font-semibold py-2.5 rounded-xl hover:bg-green-700 transition-all text-sm flex items-center justify-center gap-2'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
              </svg>
              Join Session
            </button>
          )}
          
          {canReschedule && (
            <button
              onClick={handleReschedule}
              className='flex-1 border-2 border-primary text-primary font-semibold py-2.5 rounded-xl hover:bg-primary/10 transition-all text-sm flex items-center justify-center gap-2'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
              </svg>
              Reschedule
            </button>
          )}
          
          {showCancelButton && canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className='px-4 border-2 border-red-200 text-red-600 font-semibold py-2.5 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all text-sm flex items-center justify-center gap-2'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
              </svg>
              Cancel
            </button>
          )}
          
          <button
            onClick={() => navigate(`/booking/${id}`)}
            className='px-4 border-2 border-neutral-200 text-neutral-600 font-semibold py-2.5 rounded-xl hover:border-neutral-300 hover:bg-neutral-50 transition-all text-sm'
          >
            View Details
          </button>
          {canReview && (
            <button
              onClick={() => setShowReviewModal(true)}
              className='px-4 border-2 border-amber-200 text-amber-700 font-semibold py-2.5 rounded-xl hover:bg-amber-50 transition-all text-sm'
            >
              Rate Tutor
            </button>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        bookingId={id}
        bookingDetails={booking}
      />
      <ReviewBookingModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        booking={booking}
      />
    </>
  );
}