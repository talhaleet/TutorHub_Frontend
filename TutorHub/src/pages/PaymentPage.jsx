// PaymentPage.jsx — src/pages/
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { getBooking} from '../services/bookingService';
import { createPaymentIntent, confirmPayment } from '../services/paymentService';
// import axiosInstance from '../services/axiosInstance';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// Card element styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
      iconColor: '#4f46e5',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
};

function CheckoutForm({ booking }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const createPaymentIntentMutation = useMutation({
    mutationFn: createPaymentIntent,
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to initialize payment');
      setIsProcessing(false);
    },
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: confirmPayment,
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to confirm payment');
      setIsProcessing(false);
    },
  });

  const handlePay = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      toast.error('Payment system not ready. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const { data: intentData } = await createPaymentIntentMutation.mutateAsync(booking.id);
      
      if (!intentData || !intentData.clientSecret) {
        throw new Error('Failed to initialize payment');
      }

      // Confirm card payment
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: booking?.studentName || 'Student',
              email: booking?.studentEmail || '',
            },
          },
        }
      );

      if (error) {
        toast.error(error.message);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment in backend
        await confirmPaymentMutation.mutateAsync(paymentIntent.id);
        toast.success('Payment successful!');
        navigate('/payment/success', { state: { booking, paymentIntent } });
      } else {
        toast.error('Payment was not successful. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!booking) {
    return (
      <div className='text-center py-12'>
        <p className='text-neutral-500'>Loading payment details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handlePay} className='space-y-6'>
      {/* Payment Card Input */}
      <div>
        <label className='block text-sm font-semibold text-neutral-700 mb-3'>
          Card Details *
        </label>
        <div className='border-2 border-neutral-200 rounded-xl p-4 focus-within:border-primary transition-all'>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className='text-neutral-400 text-xs mt-2'>
          Your payment is secure and encrypted
        </p>
      </div>

      {/* Payment Button */}
      <button
        type='submit'
        disabled={!stripe || isProcessing}
        className='w-full bg-green-600 text-white font-bold py-4 rounded-xl
          hover:bg-green-700 transition-all text-sm disabled:opacity-60
          disabled:cursor-not-allowed'
      >
        {isProcessing ? (
          <span className='flex items-center justify-center gap-2'>
            <svg className='animate-spin h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
            </svg>
            Processing Payment...
          </span>
        ) : (
          `Pay PKR ${booking.totalAmount?.toLocaleString() || '0'}`
        )}
      </button>

      {/* Security Badge */}
      <div className='flex items-center justify-center gap-2 text-neutral-400 text-xs'>
        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
          <path fillRule='evenodd' d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
        </svg>
        <span>Secure payment powered by Stripe</span>
      </div>
    </form>
  );
}

export default function PaymentPage() {
  const { bookingId } = useParams();
  // const navigate = useNavigate();

  const { data: bookingData, isLoading, error } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBooking(bookingId),
    enabled: !!bookingId,
  });

  const booking = bookingData?.data;

  if (isLoading) {
    return (
      <div className='min-h-screen bg-neutral-50'>
        <div className='max-w-2xl mx-auto px-4 py-16'>
          <div className='bg-white rounded-3xl shadow-xl p-8'>
            <div className='text-center py-12'>
              <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
              <p className='text-neutral-500 mt-4'>Loading payment details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className='min-h-screen bg-neutral-50'>
        <div className='max-w-2xl mx-auto px-4 py-16'>
          <div className='bg-white rounded-3xl shadow-xl p-8 text-center'>
            <svg className='w-16 h-16 mx-auto text-red-500 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <h2 className='text-xl font-bold text-neutral-800 mb-2'>Booking Not Found</h2>
            <p className='text-neutral-500 mb-6'>We couldn't find the booking you're trying to pay for.</p>
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
    <div className='min-h-screen bg-neutral-50'>
      {/* Header */}
      <div className='bg-gradient-to-r from-primary to-blue-700 py-8 px-4'>
        <div className='max-w-2xl mx-auto'>
          <Link
            to={`/booking/${booking.id}`}
            className='text-blue-200 hover:text-white text-sm mb-4 inline-block'
          >
            ← Back to Booking Details
          </Link>
          <h1 className='text-2xl font-bold text-white mt-2'>Complete Payment</h1>
          <p className='text-blue-200 text-sm mt-1'>
            Secure payment for your tutoring session
          </p>
        </div>
      </div>

      {/* Payment Form Card */}
      <div className='max-w-2xl mx-auto px-4 -mt-4 pb-16'>
        <div className='bg-white rounded-3xl shadow-xl p-8'>
          {/* Booking Summary */}
          <div className='mb-8 pb-6 border-b border-neutral-100'>
            <h2 className='text-lg font-bold text-neutral-800 mb-4'>Booking Summary</h2>
            <div className='space-y-3 text-sm'>
              <div className='flex justify-between'>
                <span className='text-neutral-500'>Session with</span>
                <span className='font-semibold text-neutral-800'>{booking.tutorName}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-neutral-500'>Subject</span>
                <span className='font-semibold text-neutral-800'>{booking.subjectName}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-neutral-500'>Date & Time</span>
                <span className='font-semibold text-neutral-800'>
                  {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.startTime}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-neutral-500'>Duration</span>
                <span className='font-semibold text-neutral-800'>{booking.durationMinutes} minutes</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-neutral-500'>Mode</span>
                <span className='font-semibold text-neutral-800'>{booking.teachingMode === 'Online' ? '🌐 Online' : '🏠 In-Person'}</span>
              </div>
              <div className='pt-3 mt-2 border-t border-neutral-100'>
                <div className='flex justify-between'>
                  <span className='text-base font-bold text-neutral-800'>Total Amount</span>
                  <span className='text-xl font-bold text-primary'>
                    PKR {booking.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stripe Elements */}
          <Elements stripe={stripePromise}>
            <CheckoutForm booking={booking} />
          </Elements>

          {/* Terms */}
          <div className='mt-6 text-center'>
            <p className='text-neutral-400 text-xs'>
              By completing this payment, you agree to our{' '}
              <Link to='/terms' className='text-primary hover:underline'>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to='/privacy' className='text-primary hover:underline'>
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}