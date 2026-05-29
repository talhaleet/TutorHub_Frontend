import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { getBooking } from '../services/bookingService';
import { createPaymentIntent, confirmPayment } from '../services/paymentService';
import PublicLayout from '../components/layout/PublicLayout';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#334155',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      '::placeholder': { color: '#94A3B8' },
      iconColor: '#1A6FE6',
    },
    invalid: { color: '#EF4444', iconColor: '#EF4444' },
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
      toast.error('Payment system not ready.');
      return;
    }

    setIsProcessing(true);

    try {
      const { data: intentData } = await createPaymentIntentMutation.mutateAsync(booking.id);
      if (!intentData || !intentData.clientSecret) throw new Error('Failed to initialize payment');

      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { name: booking?.studentName || 'Student', email: booking?.studentEmail || '' },
          },
        }
      );

      if (error) {
        toast.error(error.message);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        await confirmPaymentMutation.mutateAsync(paymentIntent.id);
        toast.success('Payment successful!');
        navigate('/payment/success', { state: { booking, paymentIntent } });
      } else {
        toast.error('Payment was not successful. Please try again.');
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <label className="form-label">Card Details</label>
        <div style={{ padding: '12px 14px', border: '1.5px solid var(--gray-200)', borderRadius: '10px', background: 'white' }}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>
      <button type="submit" disabled={!stripe || isProcessing} className="btn-primary btn-success w-full" style={{ padding: '14px', fontSize: '14px' }}>
        {isProcessing ? 'Processing Payment...' : `Pay PKR ${booking?.totalAmount?.toLocaleString() || '0'}`}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const { bookingId } = useParams();

  const { data: bookingData, isLoading, error } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBooking(bookingId),
    enabled: !!bookingId,
  });

  const booking = bookingData?.data;

  if (isLoading) return (
    <PublicLayout>
      <div style={{ padding: '100px 0', textAlign: 'center', color: 'var(--gray-500)' }}>Loading payment details...</div>
    </PublicLayout>
  );

  if (error || !booking) return (
    <PublicLayout>
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Booking Not Found</h2>
        <Link to="/dashboard" style={{ color: 'var(--blue)', fontWeight: 700, marginTop: '12px', display: 'inline-block' }}>Go to Dashboard</Link>
      </div>
    </PublicLayout>
  );

  return (
    <PublicLayout>
      <div style={{ background: 'linear-gradient(to right, var(--blue), #0B4DC4)', padding: '32px 16px' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Link to={`/booking/${booking.id}`} style={{ color: 'var(--blue-l)', textDecoration: 'none', fontSize: '13px', display: 'inline-block', marginBottom: '16px' }}>
            ← Back to Booking Details
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>Complete Payment</h1>
        </div>
      </div>

      <div style={{ maxWidth: '500px', margin: '-32px auto 60px', padding: '0 16px' }}>
        <div className="card">
          <div className="section-head">Booking Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)' }}>Session with</span>
              <span style={{ fontWeight: 600 }}>{booking.tutorName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)' }}>Subject</span>
              <span style={{ fontWeight: 600 }}>{booking.subjectName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)' }}>Date & Time</span>
              <span style={{ fontWeight: 600 }}>{new Date(booking.scheduledDate).toLocaleDateString()} at {booking.startTime}</span>
            </div>
          </div>
          
          <div className="price-display">
            <div className="amount">PKR {booking.totalAmount?.toLocaleString()}</div>
            <div className="per">Total Amount</div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm booking={booking} />
          </Elements>
        </div>
      </div>
    </PublicLayout>
  );
}