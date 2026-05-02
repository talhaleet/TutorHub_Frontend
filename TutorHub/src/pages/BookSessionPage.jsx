// BookSessionPage.jsx -- src/pages/
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {  useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { getTutorProfile } from '../services/tutorService';
import { createBooking } from '../services/bookingService';
// import { getSubjects } from '../services/searchService';
import { useBookingForm } from '../hooks/useBookingForm';
import PriceBreakdown from '../components/payment/PriceBreakdown';
import axiosInstance from '../services/axiosInstance';

const DURATIONS = [
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

const StepIndicator = ({ steps, currentStep }) => (
  <div className='flex items-center justify-center gap-2 mb-8'>
    {steps.map((label, idx) => {
      const num = idx + 1;
      const isActive = num === currentStep;
      const isCompleted = num < currentStep;
      return (
        <div key={num} className='flex items-center gap-2'>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
            ${isCompleted ? 'bg-green-500 text-white' :
              isActive ? 'bg-primary text-white' :
                'bg-neutral-200 text-neutral-500'}`}>
            {isCompleted ? '✓' : num}
          </div>
          <span className={`text-sm font-medium hidden sm:block
            ${isActive ? 'text-primary' : 'text-neutral-400'}`}>
            {label}
          </span>
          {idx < steps.length - 1 && (
            <div className={`w-12 h-0.5
              ${isCompleted ? 'bg-green-500' : 'bg-neutral-200'}`} />
          )}
        </div>
      );
    })}
  </div>
);

// Step1 Component -- inside BookSessionPage.jsx
const Step1 = ({ form, errors, setField, tutorSubjects, onNext }) => {
  // Calculate dates outside of render - use useMemo with empty deps (runs once)
  // This avoids calling Date.now() during render by calculating it before render
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
    // Only proceed if subject is selected
    if (!form.subjectName) {
      return;
    }
    onNext();
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-bold text-neutral-800'>Session Details</h2>
      {/* Subject Selection */}
      <div>
        <label className='block text-sm font-semibold text-neutral-700 mb-2'>
          Subject *
        </label>
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
          {tutorSubjects.map(subject => (
            <button
              key={subject}
              type='button'
              onClick={() => setField('subjectName', subject)}
              className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all
                ${form.subjectName === subject
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-neutral-200 text-neutral-600 hover:border-primary/50'}`}>
              {subject}
            </button>
          ))}
        </div>
        {errors.subjectName && <p className='text-red-500 text-sm mt-1'>{errors.subjectName}</p>}
      </div>
      {/* Teaching Mode */}
      <div>
        <label className='block text-sm font-semibold text-neutral-700 mb-2'>
          Session Mode *
        </label>
        <div className='flex gap-4'>
          {['Online', 'InPerson'].map(mode => (
            <button key={mode} type='button'
              onClick={() => setField('teachingMode', mode)}
              className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all
                ${form.teachingMode === mode
                  ? 'border-primary bg-primary text-white'
                  : 'border-neutral-200 text-neutral-600 hover:border-primary/50'}`}>
              {mode === 'Online' ? '🌐 Online' : '🏠 In-Person'}
            </button>
          ))}
        </div>
      </div>
      {/* Date Picker */}
      <div>
        <label className='block text-sm font-semibold text-neutral-700 mb-2'>
          Preferred Date *
        </label>
        <DatePicker
          selected={form.selectedDate}
          onChange={date => setField('selectedDate', date)}
          minDate={minDate}
          maxDate={maxDate}
          dateFormat='MMMM d, yyyy'
          placeholderText='Select a date'
          className='w-full border-2 border-neutral-200 rounded-xl px-4 py-3
            focus:border-primary focus:outline-none text-sm'
          calendarClassName='rounded-2xl shadow-xl border border-neutral-100'
        />
        {errors.selectedDate &&
          <p className='text-red-500 text-sm mt-1'>{errors.selectedDate}</p>}
      </div>
      <button onClick={handleNext}
        className='w-full bg-primary text-white font-bold py-4 rounded-xl
          hover:bg-primary/90 transition-all text-sm'>
        Continue to Time Slot →
      </button>
    </div>
  );
};

// Step2 Component -- inside BookSessionPage.jsx
const Step2 = ({ form, errors, setField, tutorId, onNext, onBack }) => {
  // Fetch public availability from Haseeb's endpoint
  const { data: slots = [], isLoading } = useQuery({
    queryKey: ['availability-public', tutorId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/tutor/${tutorId}/availability-public`);
      return res.data.data;
    },
  });

  // Filter slots for the selected day of week
  const selectedDay = form.selectedDate?.getDay() ?? -1; // 0=Sun ... 6=Sat
  const daySlots = slots.filter(s => s.dayOfWeek === selectedDay && !s.isBlocked);

  if (isLoading) return <div className='py-12 text-center text-neutral-400'>
    Loading availability...</div>;

  const handleNext = () => {
    if (!form.selectedSlot) {
      return;
    }
    onNext();
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-bold text-neutral-800'>Choose a Time Slot</h2>
      {form.selectedDate && (
        <p className='text-neutral-500 text-sm'>
          Available slots for {form.selectedDate.toLocaleDateString('en-US',
            { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      )}
      {daySlots.length === 0 ? (
        <div className='py-12 text-center bg-neutral-50 rounded-2xl'>
          <p className='text-neutral-400 font-medium'>
            No available slots on this day.</p>
          <p className='text-neutral-400 text-sm mt-1'>
            Please go back and choose a different date.</p>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
          {daySlots.map((slot, idx) => {
            const isSelected =
              form.selectedSlot?.startTime === slot.startTime;
            const timeLabel = slot.startTime.slice(0, 5); // '09:00'
            return (
              <button key={idx} type='button'
                onClick={() => setField('selectedSlot', slot)}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all
                  ${isSelected
                    ? 'border-primary bg-primary text-white'
                    : 'border-green-300 bg-green-50 text-green-700 hover:border-primary hover:bg-primary/10'}`}>
                {timeLabel}
              </button>
            );
          })}
        </div>
      )}
      {errors.selectedSlot &&
        <p className='text-red-500 text-sm'>{errors.selectedSlot}</p>}
      <div className='flex gap-3'>
        <button onClick={onBack}
          className='flex-1 border-2 border-neutral-200 text-neutral-600
            font-bold py-4 rounded-xl hover:border-primary transition-all text-sm'>
          ← Back
        </button>
        <button onClick={handleNext}
          className='flex-2 bg-primary text-white font-bold py-4 px-8
            rounded-xl hover:bg-primary/90 transition-all text-sm'>
          Continue to Duration →
        </button>
      </div>
    </div>
  );
};

// Step3 Component -- inside BookSessionPage.jsx
const Step3 = ({ form, setField, tutor, onSubmit, onBack, isSubmitting }) => (
  <div className='space-y-6'>
    <h2 className='text-xl font-bold text-neutral-800'>Duration & Review</h2>
    {/* Duration Buttons */}
    <div>
      <label className='block text-sm font-semibold text-neutral-700 mb-3'>
        Session Duration *
      </label>
      <div className='grid grid-cols-4 gap-3'>
        {DURATIONS.map(d => (
          <button key={d.value} type='button'
            onClick={() => setField('durationMinutes', d.value)}
            className={`py-3 rounded-xl border-2 text-sm font-bold transition-all
              ${form.durationMinutes === d.value
                ? 'border-primary bg-primary text-white'
                : 'border-neutral-200 text-neutral-600 hover:border-primary/50'}`}>
            {d.label}
          </button>
        ))}
      </div>
    </div>
    {/* Live Price Breakdown */}
    <PriceBreakdown
      hourlyRateMin={tutor?.hourlyRateMin}
      durationMinutes={form.durationMinutes}
    />
    {/* Optional Notes */}
    <div>
      <label className='block text-sm font-semibold text-neutral-700 mb-2'>
        Notes for Tutor (Optional)
      </label>
      <textarea
        value={form.studentNotes}
        onChange={e => setField('studentNotes', e.target.value)}
        rows={3}
        maxLength={500}
        placeholder='Topics to cover, special requirements...'
        className='w-full border-2 border-neutral-200 rounded-xl px-4 py-3
          focus:border-primary focus:outline-none text-sm resize-none'
      />
    </div>
    {/* Summary Card */}
    <div className='bg-neutral-50 rounded-2xl p-5 border border-neutral-100 text-sm space-y-2'>
      <p className='font-bold text-neutral-700 mb-3'>Booking Summary</p>
      <div className='flex justify-between'>
        <span className='text-neutral-500'>Tutor</span>
        <span className='font-semibold'>{tutor?.fullName}</span>
      </div>
      <div className='flex justify-between'>
        <span className='text-neutral-500'>Subject</span>
        <span className='font-semibold'>{form.subjectName}</span>
      </div>
      <div className='flex justify-between'>
        <span className='text-neutral-500'>Date</span>
        <span className='font-semibold'>
          {form.selectedDate?.toLocaleDateString('en-US',
            { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>
      <div className='flex justify-between'>
        <span className='text-neutral-500'>Time</span>
        <span className='font-semibold'>
          {form.selectedSlot?.startTime?.slice(0, 5) || '--'}</span>
      </div>
      <div className='flex justify-between'>
        <span className='text-neutral-500'>Mode</span>
        <span className='font-semibold'>{form.teachingMode}</span>
      </div>
    </div>
    <div className='flex gap-3'>
      <button onClick={onBack}
        className='flex-1 border-2 border-neutral-200 text-neutral-600 font-bold
          py-4 rounded-xl hover:border-primary transition-all text-sm'>
        ← Back
      </button>
      <button onClick={onSubmit} disabled={isSubmitting}
        className='flex-2 bg-green-600 text-white font-bold py-4 px-8
          rounded-xl hover:bg-green-700 transition-all text-sm disabled:opacity-60'>
        {isSubmitting ? 'Booking...' : '✓ Confirm & Proceed to Payment'}
      </button>
    </div>
  </div>
);

// Main BookSessionPage component -- bottom of BookSessionPage.jsx
const BookSessionPage = () => {
  const { tutorId } = useParams();
  const navigate = useNavigate();
  const { step, form, errors, steps, setField, nextStep, prevStep } = useBookingForm();
  const { data: tutorData } = useQuery({
    queryKey: ['tutor', tutorId],
    queryFn: () => getTutorProfile(tutorId),
  });

  const tutor = tutorData?.data;

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      toast.success('Booking created! Proceed to payment.');
      navigate(`/payment/${data.data.id}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    },
  });

  const handleSubmit = () => {
    bookingMutation.mutate({
      tutorUserId: tutorId,
      subjectName: form.subjectName,
      teachingMode: form.teachingMode,
      scheduledDate: form.selectedDate?.toISOString(),
      startTime: form.selectedSlot?.startTime,
      durationMinutes: form.durationMinutes,
      studentNotes: form.studentNotes,
    });
  };

  return (
    <div className='min-h-screen bg-neutral-50'>
      {/* Header */}
      <div className='bg-gradient-to-r from-primary to-blue-700 py-8 px-4'>
        <div className='max-w-2xl mx-auto'>
          <Link to={`/tutor/${tutorId}`}
            className='text-blue-200 hover:text-white text-sm mb-4 inline-block'>
            ← Back to Profile
          </Link>
          <h1 className='text-2xl font-bold text-white mt-2'>
            Book a Session
          </h1>
          {tutor && (
            <p className='text-blue-200 text-sm mt-1'>
              with {tutor.fullName} · PKR {tutor.hourlyRateMin?.toLocaleString()}/hr
            </p>
          )}
        </div>
      </div>
      {/* Form Card */}
      <div className='max-w-2xl mx-auto px-4 -mt-4 pb-16'>
        <div className='bg-white rounded-3xl shadow-xl p-8'>
          <StepIndicator steps={steps} currentStep={step} />
          {step === 1 && <Step1
            form={form} errors={errors} setField={setField}
            tutorSubjects={tutor?.subjects || []}
            onNext={nextStep}
          />}
          {step === 2 && <Step2
            form={form} errors={errors} setField={setField}
            tutorId={tutorId} onNext={nextStep} onBack={prevStep}
          />}
          {step === 3 && <Step3
            form={form} setField={setField} tutor={tutor}
            onSubmit={handleSubmit} onBack={prevStep}
            isSubmitting={bookingMutation.isPending}
          />}
        </div>
      </div>
    </div>
  );
};

export default BookSessionPage;