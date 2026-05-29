// bookingService.js -- src/services/
import axiosInstance from './axiosInstance';

const pick = (obj, camel, pascal) => obj?.[camel] ?? obj?.[pascal];

const formatBookingDateTime = (b) => {
  const dateRaw = pick(b, 'scheduledDate', 'ScheduledDate');
  const timeRaw = pick(b, 'startTime', 'StartTime');
  if (!dateRaw) return '—';
  const date = new Date(dateRaw);
  const timeStr = typeof timeRaw === 'string'
    ? timeRaw.split(':').slice(0, 2).join(':')
  : '';
  const datePart = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  return timeStr ? `${datePart}, ${timeStr}` : datePart;
};

export const normalizeBooking = (b) => {
  if (!b) return null;
  const status = pick(b, 'status', 'Status') ?? 'Pending';
  return {
    id: pick(b, 'id', 'Id'),
    tutorId: pick(b, 'tutorUserId', 'TutorUserId') ?? pick(b, 'tutorId', 'TutorId'),
    studentId: pick(b, 'studentUserId', 'StudentUserId') ?? pick(b, 'studentId', 'StudentId'),
    studentName: pick(b, 'studentName', 'StudentName') ?? 'Student',
    tutorName: pick(b, 'tutorName', 'TutorName') ?? 'Tutor',
    subject: pick(b, 'subject', 'Subject') ?? '',
    subjectName: pick(b, 'subject', 'Subject') ?? '',
    scheduledDate: pick(b, 'scheduledDate', 'ScheduledDate'),
    startTime: pick(b, 'startTime', 'StartTime'),
    durationMinutes: pick(b, 'durationMinutes', 'DurationMinutes'),
    teachingMode: pick(b, 'teachingMode', 'TeachingMode'),
    status,
    totalAmount: pick(b, 'totalAmount', 'TotalAmount') ?? 0,
    tutorEarning: pick(b, 'tutorEarning', 'TutorEarning'),
    studentNotes: pick(b, 'studentNotes', 'StudentNotes'),
    meetingLink: pick(b, 'meetingLink', 'MeetingLink'),
    meetLink: pick(b, 'meetingLink', 'MeetingLink'),
    dateTime: formatBookingDateTime(b),
    duration: b.duration ?? (pick(b, 'durationMinutes', 'DurationMinutes')
      ? `${pick(b, 'durationMinutes', 'DurationMinutes')} min`
      : ''),
    amount: pick(b, 'totalAmount', 'TotalAmount') ?? 0,
    cancelReason: pick(b, 'cancellationReason', 'CancellationReason'),
  };
};

// Student/Parent: Create new booking request
export const createBooking = async (data) => {
  const res = await axiosInstance.post('/api/booking', data);
  return res.data;
};

export const getBooking = async (id) => {
  const res = await axiosInstance.get(`/api/booking/${id}`);
  const raw = res.data?.data ?? res.data;
  return { data: normalizeBooking(raw) };
};

export const getMyBookings = async () => {
  const res = await axiosInstance.get('/api/booking/my');
  const list = res.data?.data ?? res.data ?? [];
  const normalized = Array.isArray(list) ? list.map(normalizeBooking) : [];
  return { data: normalized };
};
// Tutor: confirm a pending booking
export const confirmBooking = async (id) => {
 const res = await axiosInstance.put(`/api/booking/${id}/confirm`);
 return res.data;
};
// Cancel a booking (student, parent, or tutor)
export const cancelBooking = async (id, reason) => {
 const normalizedReason = typeof reason === 'string' ? reason : (reason?.reason ?? '');
 const res = await axiosInstance.put(`/api/booking/${id}/cancel`, { reason: normalizedReason });
 return res.data;
};