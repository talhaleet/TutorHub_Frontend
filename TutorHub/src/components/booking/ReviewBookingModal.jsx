import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addReview } from '../../services/reviewService';
import toast from 'react-hot-toast';

export default function ReviewBookingModal({ isOpen, onClose, booking }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) => addReview(payload),
    onSuccess: () => {
      toast.success('Thanks! Your review was submitted.');
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', booking?.tutorId] });
      onClose();
      setRating(5);
      setComment('');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Could not submit review');
    },
  });

  if (!isOpen || !booking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!booking?.tutorId || !booking?.id) {
      toast.error('Missing booking or tutor information');
      return;
    }
    mutation.mutate({
      tutorId: booking.tutorId,
      bookingId: booking.id,
      rating,
      comment: comment.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Rate Your Tutor</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Share your experience for <span className="font-semibold">{booking.tutorName}</span> ({booking.subjectName || booking.subject}).
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
              <div className="flex gap-1 text-2xl">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className={n <= rating ? 'text-amber-400' : 'text-slate-300'}
                    aria-label={`Rate ${n} stars`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Comment (optional)</label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="What did you like? What could be improved?"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-60"
              >
                {mutation.isPending ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

