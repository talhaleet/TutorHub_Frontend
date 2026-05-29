import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import React from 'react';
import PublicLayout from '../components/layout/PublicLayout';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, paymentIntent } = location.state || {};

  React.useEffect(() => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#22C55E', '#1A6FE6', '#8B5CF6', '#F97316'] });
    setTimeout(() => {
      confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.5 }, colors: ['#22C55E', '#1A6FE6'] });
      confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.5 }, colors: ['#22C55E', '#1A6FE6'] });
    }, 150);
  }, []);

  if (!booking) {
    return (
      <PublicLayout>
        <div style={{ padding: '100px 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>No Booking Information</h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>We couldn't find the booking details.</p>
          <Link to="/dashboard" className="btn-primary" style={{ padding: '12px 24px', textDecoration: 'none' }}>Go to Dashboard</Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div style={{ background: 'var(--gray-50)', minHeight: '80vh', padding: '60px 16px 80px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          {/* Success Icon */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '96px', height: '96px', background: 'var(--green-l)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <svg width="48" height="48" fill="none" stroke="var(--green)" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--gray-900)', marginBottom: '8px' }}>Booking Confirmed! 🎉</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '16px' }}>Your session has been successfully booked and paid for</p>
          </div>

          {/* Booking Details Card */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="section-head" style={{ marginBottom: '20px' }}>Booking Details</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-500)' }}>Booking ID</span>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>#{booking.id?.slice(-8) || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-500)' }}>Tutor</span>
                  <span style={{ fontWeight: 700 }}>{booking.tutorName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-500)' }}>Subject</span>
                  <span style={{ fontWeight: 700 }}>{booking.subjectName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-500)' }}>Mode</span>
                  <span style={{ fontWeight: 700 }}>{booking.teachingMode === 'Online' ? '🌐 Online' : '🏠 In-Person'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-500)' }}>Date</span>
                  <span style={{ fontWeight: 700 }}>{new Date(booking.scheduledDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-500)' }}>Time</span>
                  <span style={{ fontWeight: 700 }}>{booking.startTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-500)' }}>Duration</span>
                  <span style={{ fontWeight: 700 }}>{booking.durationMinutes} minutes</span>
                </div>
              </div>
            </div>

            <div className="price-display" style={{ marginTop: '20px' }}>
              <div className="amount" style={{ color: 'var(--green)' }}>PKR {booking.totalAmount?.toLocaleString()}</div>
              <div className="per">Amount Paid</div>
            </div>

            {paymentIntent && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--gray-400)' }}>
                <span>Transaction ID</span>
                <span style={{ fontFamily: 'monospace' }}>{paymentIntent.id}</span>
              </div>
            )}
          </div>

          {/* Next Steps Card */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="section-head" style={{ marginBottom: '16px' }}>What's Next?</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { num: 1, title: 'Check your email', desc: "You'll receive a confirmation email with all session details" },
                { num: 2, title: 'Prepare for your session', desc: 'Gather your materials and prepare questions for the tutor' },
                { num: 3, title: 'Join on time', desc: 'Connect with your tutor at the scheduled time' },
              ].map(step => (
                <div key={step.num} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--blue-l)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0, marginTop: '2px' }}>{step.num}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--gray-800)', marginBottom: '2px' }}>{step.title}</div>
                    <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/dashboard/bookings')} className="btn-primary" style={{ flex: 1, padding: '14px', minWidth: '140px' }}>View My Bookings</button>
            <button onClick={() => navigate(`/tutor/${booking.tutorId}`)} className="btn-outline" style={{ flex: 1, padding: '14px', minWidth: '140px' }}>View Tutor Profile</button>
            <button onClick={() => navigate('/search')} className="btn-outline" style={{ flex: 1, padding: '14px', minWidth: '140px', borderColor: 'var(--gray-200)', color: 'var(--gray-600)' }}>Book More Sessions</button>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}