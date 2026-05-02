// PaymentSuccessPage.jsx — src/pages/
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import React from 'react';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, paymentIntent } = location.state || {};

  // Trigger confetti animation when page loads
  React.useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
    });
    
    // Trigger multiple confetti bursts
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
        colors: ['#10b981', '#3b82f6']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
        colors: ['#10b981', '#3b82f6']
      });
    }, 150);
  }, []);

  if (!booking) {
    return (
      <div className='min-h-screen bg-neutral-50'>
        <div className='max-w-2xl mx-auto px-4 py-16'>
          <div className='bg-white rounded-3xl shadow-xl p-8 text-center'>
            <svg className='w-16 h-16 mx-auto text-yellow-500 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <h2 className='text-xl font-bold text-neutral-800 mb-2'>No Booking Information</h2>
            <p className='text-neutral-500 mb-6'>We couldn't find the booking details.</p>
            <Link
              to='/dashboard'
              className='inline-block bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-all'
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50'>
      {/* Success Header */}
      <div className='max-w-2xl mx-auto px-4 py-12'>
        {/* Animated Success Icon */}
        <div className='flex justify-center mb-6'>
          <div className='relative'>
            <div className='absolute inset-0 animate-ping'>
              <div className='w-24 h-24 rounded-full bg-green-400 opacity-20'></div>
            </div>
            <div className='relative w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-bounce'>
              <svg className='w-12 h-12 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-neutral-800 mb-2'>
            Booking Confirmed! 🎉
          </h1>
          <p className='text-neutral-500 text-lg'>
            Your session has been successfully booked and paid for
          </p>
        </div>

        {/* Booking Details Card */}
        <div className='bg-white rounded-3xl shadow-xl p-8 mb-6'>
          <div className='flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100'>
            <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
              <svg className='w-5 h-5 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h2 className='text-xl font-bold text-neutral-800'>Booking Details</h2>
          </div>

          <div className='grid md:grid-cols-2 gap-4 text-sm'>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-neutral-500'>Booking ID</span>
                <span className='font-semibold text-neutral-800 font-mono'>
                  #{booking.id?.slice(-8) || 'N/A'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-neutral-500'>Tutor</span>
                <span className='font-semibold text-neutral-800'>{booking.tutorName}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-neutral-500'>Subject</span>
                <span className='font-semibold text-neutral-800'>{booking.subjectName}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-neutral-500'>Mode</span>
                <span className='font-semibold text-neutral-800'>
                  {booking.teachingMode === 'Online' ? '🌐 Online' : '🏠 In-Person'}
                </span>
              </div>
            </div>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-neutral-500'>Date</span>
                <span className='font-semibold text-neutral-800'>
                  {new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-neutral-500'>Time</span>
                <span className='font-semibold text-neutral-800'>{booking.startTime}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-neutral-500'>Duration</span>
                <span className='font-semibold text-neutral-800'>{booking.durationMinutes} minutes</span>
              </div>
              <div className='flex justify-between pt-2 border-t border-neutral-100'>
                <span className='text-base font-bold text-neutral-800'>Amount Paid</span>
                <span className='text-xl font-bold text-green-600'>
                  PKR {booking.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {paymentIntent && (
            <div className='mt-4 pt-4 border-t border-neutral-100'>
              <div className='flex justify-between text-xs text-neutral-400'>
                <span>Transaction ID</span>
                <span className='font-mono'>{paymentIntent.id}</span>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps Card */}
        <div className='bg-white rounded-3xl shadow-xl p-8 mb-6'>
          <h3 className='font-bold text-neutral-800 mb-4 flex items-center gap-2'>
            <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            What's Next?
          </h3>
          <div className='space-y-3'>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5'>1</div>
              <div>
                <p className='font-semibold text-neutral-700'>Check your email</p>
                <p className='text-neutral-500 text-sm'>You'll receive a confirmation email with all session details</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5'>2</div>
              <div>
                <p className='font-semibold text-neutral-700'>Prepare for your session</p>
                <p className='text-neutral-500 text-sm'>Gather your materials and prepare questions for the tutor</p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5'>3</div>
              <div>
                <p className='font-semibold text-neutral-700'>Join on time</p>
                <p className='text-neutral-500 text-sm'>Connect with your tutor at the scheduled time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <button
            onClick={() => navigate('/dashboard/bookings')}
            className='flex-1 bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all text-sm flex items-center justify-center gap-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
            </svg>
            View My Bookings
          </button>
          <button
            onClick={() => navigate(`/tutor/${booking.tutorId}`)}
            className='flex-1 border-2 border-primary text-primary font-bold py-4 rounded-xl hover:bg-primary/10 transition-all text-sm flex items-center justify-center gap-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
            View Tutor Profile
          </button>
          <button
            onClick={() => navigate('/search')}
            className='flex-1 border-2 border-neutral-200 text-neutral-600 font-bold py-4 rounded-xl hover:border-primary/50 hover:text-primary transition-all text-sm flex items-center justify-center gap-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
            Book More Sessions
          </button>
        </div>

        {/* Share Section */}
        <div className='mt-8 text-center'>
          <p className='text-neutral-400 text-sm mb-3'>Share your achievement</p>
          <div className='flex justify-center gap-3'>
            <button className='w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-all'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
              </svg>
            </button>
            <button className='w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-all'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' />
              </svg>
            </button>
            <button className='w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-900 transition-all'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}