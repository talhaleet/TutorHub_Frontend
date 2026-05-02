// src/components/bookings/CancelBookingModal.jsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelBooking } from '../../services/bookingService';
import toast from 'react-hot-toast';

export default function CancelBookingModal({ isOpen, onClose, bookingId, bookingDetails }) {
  const [setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const queryClient = useQueryClient();

  const cancellationReasons = [
    { value: 'schedule_conflict', label: 'Schedule Conflict' },
    { value: 'found_another_tutor', label: 'Found Another Tutor' },
    { value: 'change_of_plans', label: 'Change of Plans' },
    { value: 'technical_issues', label: 'Technical Issues' },
    { value: 'other', label: 'Other' },
  ];

  const mutation = useMutation({
    mutationFn: () => cancelBooking(bookingId, {
      reason: selectedReason === 'other' ? otherReason : selectedReason,
      category: selectedReason
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['myBookings']);
      toast.success('Booking cancelled successfully');
      onClose();
      setReason('');
      setSelectedReason('');
      setOtherReason('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedReason) {
      toast.error('Please select a reason for cancellation');
      return;
    }
    if (selectedReason === 'other' && !otherReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    mutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black bg-opacity-50 transition-opacity' onClick={onClose}></div>

      {/* Modal */}
      <div className='flex min-h-full items-center justify-center p-4'>
        <div className='relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all'>
          {/* Header */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-red-100 flex items-center justify-center'>
                <svg className='w-5 h-5 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                </svg>
              </div>
              <h2 className='text-xl font-bold text-neutral-800'>Cancel Booking</h2>
            </div>
            <button
              onClick={onClose}
              className='text-neutral-400 hover:text-neutral-600 transition-colors'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          {/* Booking Summary */}
          {bookingDetails && (
            <div className='mb-4 p-3 bg-neutral-50 rounded-lg text-sm'>
              <p className='font-semibold text-neutral-700 mb-1'>Session Details:</p>
              <p className='text-neutral-600'>📚 {bookingDetails.subjectName}</p>
              <p className='text-neutral-600'>👨‍🏫 {bookingDetails.tutorName}</p>
              <p className='text-neutral-600'>📅 {new Date(bookingDetails.scheduledDate).toLocaleDateString()}</p>
              <p className='text-neutral-600'>⏰ {bookingDetails.startTime} ({bookingDetails.durationMinutes} min)</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Cancellation Reason */}
            <div className='mb-4'>
              <label className='block text-sm font-semibold text-neutral-700 mb-2'>
                Reason for Cancellation *
              </label>
              <div className='space-y-2'>
                {cancellationReasons.map((reasonOption) => (
                  <label key={reasonOption.value} className='flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg cursor-pointer'>
                    <input
                      type='radio'
                      name='cancellationReason'
                      value={reasonOption.value}
                      checked={selectedReason === reasonOption.value}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className='w-4 h-4 text-red-600 focus:ring-red-500'
                    />
                    <span className='text-sm text-neutral-700'>{reasonOption.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Other Reason Textarea */}
            {selectedReason === 'other' && (
              <div className='mb-4'>
                <label className='block text-sm font-semibold text-neutral-700 mb-2'>
                  Please specify *
                </label>
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  rows={3}
                  placeholder='Tell us why you need to cancel this session...'
                  className='w-full border-2 border-neutral-200 rounded-xl px-4 py-3 focus:border-primary focus:outline-none text-sm resize-none'
                />
              </div>
            )}

            {/* Warning Message */}
            <div className='mb-5 p-3 bg-red-50 rounded-lg border border-red-200'>
              <p className='text-xs text-red-700'>
                ⚠️ Cancelling this booking will:
                <br />• Release the time slot for other students
                <br />• Refund the payment according to our refund policy
                <br />• Notify the tutor about the cancellation
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3'>
              <button
                type='button'
                onClick={onClose}
                className='flex-1 border-2 border-neutral-200 text-neutral-600 font-semibold py-3 rounded-xl hover:border-neutral-300 transition-all text-sm'
              >
                Keep Booking
              </button>
              <button
                type='submit'
                disabled={mutation.isPending}
                className='flex-1 bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed'
              >
                {mutation.isPending ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}