import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { getTutorProfile } from '../services/tutorService';
import { getSubjects } from '../services/searchService';
import { createBooking, getBooking, cancelBooking } from '../services/bookingService';
import { subjectId, subjectName } from '../utils/subjectUtils';
import { useBookingForm } from '../hooks/useBookingForm';
import PriceBreakdown from '../components/payment/PriceBreakdown';
import axiosInstance from '../services/axiosInstance';
import PublicLayout from '../components/layout/PublicLayout';

const DURATIONS = [
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

const StepIndicator = ({ steps, currentStep }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
    {steps.map((label, idx) => {
      const num = idx + 1;
      const isActive = num === currentStep;
      const isCompleted = num < currentStep;
      return (
        <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 'bold', transition: 'all 0.3s',
            background: isCompleted ? 'var(--green)' : isActive ? 'var(--blue)' : 'var(--gray-200)',
            color: isCompleted || isActive ? 'white' : 'var(--gray-500)'
          }}>
            {isCompleted ? '✓' : num}
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: isActive ? 'var(--blue)' : 'var(--gray-400)', display: window.innerWidth > 600 ? 'block' : 'none' }}>
            {label}
          </span>
          {idx < steps.length - 1 && (
            <div style={{ width: '48px', height: '2px', background: isCompleted ? 'var(--green)' : 'var(--gray-200)' }} />
          )}
        </div>
      );
    })}
  </div>
);

const Step1 = ({ form, errors, setField, tutorSubjects, catalogSubjects, onNext }) => {
  const minDate = useMemo(() => {
    const date = new Date();
    date.setHours(date.getHours() + 2);
    return date;
  }, []);
  
  const maxDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 60);
    return date;
  }, []);

  const handleNext = () => {
    if (!form.subjectName) return;
    onNext();
  };

  return (
    <div className="booking-form">
      <div className="section-head">Session Details</div>
      
      <div style={{ marginBottom: '20px' }}>
        <label className="form-label">Subject *</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
          {tutorSubjects.map((subject, idx) => {
            const name = subjectName(subject);
            let id = subjectId(subject);
            if (!id && catalogSubjects?.length) {
              const match = catalogSubjects.find(
                (c) => (c.name || c).toLowerCase() === name.toLowerCase()
              );
              id = match?.id ?? match?.Id;
            }
            const selected = form.subjectName === name;
            return (
            <button
              key={id ?? `${name}-${idx}`}
              type="button"
              onClick={() => {
                setField('subjectName', name);
                setField('subjectId', id ?? null);
              }}
              style={{
                padding: '12px 16px', borderRadius: '12px', border: '2px solid', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                borderColor: selected ? 'var(--blue)' : 'var(--gray-200)',
                background: selected ? 'var(--blue-l)' : 'white',
                color: selected ? 'var(--blue)' : 'var(--gray-600)'
              }}>
              {name}
            </button>
          );})}
        </div>
        {errors.subjectName && <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{errors.subjectName}</p>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label className="form-label">Session Mode *</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['Online', 'InPerson'].map(mode => (
            <button key={mode} type="button"
              onClick={() => setField('teachingMode', mode)}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: '12px', border: '2px solid', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                borderColor: form.teachingMode === mode ? 'var(--blue)' : 'var(--gray-200)',
                background: form.teachingMode === mode ? 'var(--blue)' : 'white',
                color: form.teachingMode === mode ? 'white' : 'var(--gray-600)'
              }}>
              {mode === 'Online' ? '🌐 Online' : '🏠 In-Person'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label className="form-label">Preferred Date *</label>
        <DatePicker
          selected={form.selectedDate}
          onChange={date => setField('selectedDate', date)}
          minDate={minDate}
          maxDate={maxDate}
          dateFormat="MMMM d, yyyy"
          placeholderText="Select a date"
          className="form-control"
          wrapperClassName="w-full"
        />
        {errors.selectedDate && <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{errors.selectedDate}</p>}
      </div>

      <button className="btn-primary w-full" onClick={handleNext} style={{ padding: '14px', fontSize: '14px' }}>
        Continue to Time Slot →
      </button>
    </div>
  );
};

const Step2 = ({ form, errors, setField, tutorId, onNext, onBack }) => {
  const { data: slots = [], isLoading } = useQuery({
    queryKey: ['availability-public', tutorId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/tutor/${tutorId}/availability-public`);
      return res.data.data;
    },
  });

  const selectedDay = form.selectedDate?.getDay() ?? -1;
  const daySlots = slots.filter(s => s.dayOfWeek === selectedDay && !s.isBlocked);

  if (isLoading) return <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--gray-400)' }}>Loading availability...</div>;

  const handleNext = () => {
    if (!form.selectedSlot) return;
    onNext();
  };

  return (
    <div className="booking-form">
      <div className="section-head">Choose a Time Slot</div>
      {form.selectedDate && (
        <p style={{ color: 'var(--gray-500)', fontSize: '13px', marginBottom: '16px' }}>
          Available slots for {form.selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      )}

      {daySlots.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--gray-50)', borderRadius: '16px', marginBottom: '24px' }}>
          <p style={{ color: 'var(--gray-500)', fontWeight: 600 }}>No available slots on this day.</p>
          <p style={{ color: 'var(--gray-400)', fontSize: '13px', marginTop: '4px' }}>Please go back and choose a different date.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {daySlots.map((slot, idx) => {
            const isSelected = form.selectedSlot?.startTime === slot.startTime;
            const timeLabel = slot.startTime.slice(0, 5);
            return (
              <button key={idx} type="button"
                onClick={() => setField('selectedSlot', slot)}
                style={{
                  padding: '12px', borderRadius: '12px', border: '2px solid', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                  borderColor: isSelected ? 'var(--blue)' : 'var(--green-l)',
                  background: isSelected ? 'var(--blue)' : 'var(--green-l)',
                  color: isSelected ? 'white' : 'var(--green)'
                }}>
                {timeLabel}
              </button>
            );
          })}
        </div>
      )}
      {errors.selectedSlot && <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '4px' }}>{errors.selectedSlot}</p>}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="btn-outline" onClick={onBack} style={{ flex: 1 }}>← Back</button>
        <button className="btn-primary" onClick={handleNext} style={{ flex: 2 }}>Continue to Duration →</button>
      </div>
    </div>
  );
};

const Step3 = ({ form, setField, tutor, onSubmit, onBack, isSubmitting }) => (
  <div className="booking-form">
    <div className="section-head">Duration & Review</div>
    
    <div style={{ marginBottom: '20px' }}>
      <label className="form-label">Session Duration *</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {DURATIONS.map(d => (
          <button key={d.value} type="button"
            onClick={() => setField('durationMinutes', d.value)}
            style={{
              padding: '12px', borderRadius: '12px', border: '2px solid', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              borderColor: form.durationMinutes === d.value ? 'var(--blue)' : 'var(--gray-200)',
              background: form.durationMinutes === d.value ? 'var(--blue)' : 'white',
              color: form.durationMinutes === d.value ? 'white' : 'var(--gray-600)'
            }}>
            {d.label}
          </button>
        ))}
      </div>
    </div>

    <PriceBreakdown hourlyRateMin={tutor?.hourlyRateMin} durationMinutes={form.durationMinutes} />
    
    <div style={{ margin: '20px 0' }}>
      <label className="form-label">Notes for Tutor (Optional)</label>
      <textarea
        value={form.studentNotes}
        onChange={e => setField('studentNotes', e.target.value)}
        rows={3}
        maxLength={500}
        placeholder="Topics to cover, special requirements..."
        className="form-control"
        style={{ height: 'auto', padding: '12px', resize: 'none' }}
      />
    </div>

    <div style={{ background: 'var(--gray-50)', borderRadius: '16px', padding: '20px', border: '1px solid var(--gray-100)', fontSize: '13px', marginBottom: '24px' }}>
      <p style={{ fontWeight: 700, color: 'var(--gray-700)', marginBottom: '12px' }}>Booking Summary</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: 'var(--gray-500)' }}>Tutor</span>
        <span style={{ fontWeight: 600 }}>{tutor?.fullName}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: 'var(--gray-500)' }}>Subject</span>
        <span style={{ fontWeight: 600 }}>{form.subjectName}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: 'var(--gray-500)' }}>Date</span>
        <span style={{ fontWeight: 600 }}>{form.selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: 'var(--gray-500)' }}>Time</span>
        <span style={{ fontWeight: 600 }}>{form.selectedSlot?.startTime?.slice(0, 5) || '--'}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--gray-500)' }}>Mode</span>
        <span style={{ fontWeight: 600 }}>{form.teachingMode}</span>
      </div>
    </div>

    <div style={{ display: 'flex', gap: '12px' }}>
      <button className="btn-outline" onClick={onBack} style={{ flex: 1 }}>← Back</button>
      <button className="btn-primary btn-success" onClick={onSubmit} disabled={isSubmitting} style={{ flex: 2 }}>
        {isSubmitting ? 'Booking...' : '✓ Confirm Booking'}
      </button>
    </div>
  </div>
);

const BookSessionPage = () => {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rescheduleOf = searchParams.get('rescheduleOf');
  const { step, form, errors, steps, setField, nextStep, prevStep } = useBookingForm();
  const { data: tutorData, isLoading: tutorLoading, isError: tutorError } = useQuery({
    queryKey: ['tutor', tutorId],
    queryFn: () => getTutorProfile(tutorId),
  });

  const { data: catalogSubjects = [] } = useQuery({
    queryKey: ['subjects-catalog'],
    queryFn: getSubjects,
    staleTime: 1000 * 60 * 10,
  });

  const tutor = tutorData?.data;
  const { data: previousBookingData } = useQuery({
    queryKey: ['booking', rescheduleOf],
    queryFn: () => getBooking(rescheduleOf),
    enabled: !!rescheduleOf,
  });
  const previousBooking = previousBookingData?.data;

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: async (data) => {
      if (rescheduleOf) {
        try {
          await cancelBooking(rescheduleOf, `Rescheduled to booking #${data?.data?.id}`);
          toast.success('Session rescheduled successfully!');
        } catch {
          toast.success('New booking created. Please cancel old booking manually.');
        }
      } else {
        toast.success('Booking created! Proceed to payment.');
      }
      navigate(`/payment/${data.data.id}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (!form.subjectId) {
      toast.error('Could not resolve subject. Ask the tutor to add subjects to their profile.');
      return;
    }
    const startRaw = form.selectedSlot?.startTime ?? '09:00';
    const startTime = startRaw.length === 5 ? `${startRaw}:00` : startRaw;
    bookingMutation.mutate({
      tutorId,
      subjectId: form.subjectId,
      teachingMode: form.teachingMode,
      scheduledDate: form.selectedDate ? new Date(form.selectedDate).toISOString().split('T')[0] : null,
      startTime,
      durationMinutes: form.durationMinutes,
      studentNotes: form.studentNotes || null,
    });
  };

  return (
    <PublicLayout>
      <div style={{ background: 'linear-gradient(to right, var(--blue), #0B4DC4)', padding: '32px 16px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Link to={`/tutor/${tutorId}`} style={{ color: 'var(--blue-l)', textDecoration: 'none', fontSize: '13px', display: 'inline-block', marginBottom: '16px' }}>
            ← Back to Profile
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>Book a Session</h1>
          {tutor && (
            <p style={{ color: 'var(--blue-l)', fontSize: '13px', marginTop: '4px' }}>
              with {tutor.fullName} · PKR {tutor.hourlyRateMin?.toLocaleString()}/hr
            </p>
          )}
          {rescheduleOf && (
            <p style={{ color: 'white', fontSize: '12px', marginTop: '8px', background: 'rgba(255,255,255,0.12)', padding: '6px 10px', borderRadius: '999px', display: 'inline-block' }}>
              Rescheduling booking #{rescheduleOf}{previousBooking?.scheduledDate ? ` from ${new Date(previousBooking.scheduledDate).toLocaleDateString()}` : ''}
            </p>
          )}
        </div>
      </div>
      <div style={{ maxWidth: '600px', margin: '-32px auto 60px', padding: '0 16px' }}>
        <div className="card">
          {tutorLoading ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>Loading tutor...</p>
          ) : tutorError || !tutor ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>
              Tutor not found. <Link to="/search">Back to search</Link>
            </p>
          ) : (
          <>
          <StepIndicator steps={steps} currentStep={step} />
          {step === 1 && (
            <Step1
              form={form}
              errors={errors}
              setField={setField}
              catalogSubjects={catalogSubjects}
              tutorSubjects={tutor.subjects?.length ? tutor.subjects : (tutor.subjectNames || [])}
              onNext={nextStep}
            />
          )}
          {step === 2 && <Step2 form={form} errors={errors} setField={setField} tutorId={tutorId} onNext={nextStep} onBack={prevStep} />}
          {step === 3 && <Step3 form={form} setField={setField} tutor={tutor} onSubmit={handleSubmit} onBack={prevStep} isSubmitting={bookingMutation.isPending} />}
          </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default BookSessionPage;