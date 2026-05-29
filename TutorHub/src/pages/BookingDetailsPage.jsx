import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardShell from '../components/layout/DashboardShell';
import { getBooking } from '../services/bookingService';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBooking(id),
    enabled: !!id,
  });

  const booking = data?.data;

  return (
    <DashboardLayout>
      <DashboardShell className="max-w-3xl mx-auto w-full">
        <div className="mb-4">
          <button onClick={() => navigate(-1)} className="text-sm text-blue-600 font-semibold hover:underline">
            ← Back
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          {isLoading ? (
            <p className="text-slate-500">Loading booking details...</p>
          ) : isError || !booking ? (
            <p className="text-red-600">Booking details not found.</p>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Booking #{booking.id}</h1>
              <p className="text-slate-500 mb-6">{booking.subjectName || booking.subject} with {booking.tutorName}</p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-xs font-semibold">DATE</div>
                  <div className="font-bold text-slate-800 mt-1">{booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : '—'}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-xs font-semibold">TIME</div>
                  <div className="font-bold text-slate-800 mt-1">{booking.startTime || '—'} ({booking.durationMinutes || 0} min)</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-xs font-semibold">MODE</div>
                  <div className="font-bold text-slate-800 mt-1">{booking.teachingMode || '—'}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-xs font-semibold">AMOUNT</div>
                  <div className="font-bold text-slate-800 mt-1">PKR {Number(booking.totalAmount || 0).toLocaleString()}</div>
                </div>
              </div>
              {booking.studentNotes && (
                <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="text-blue-700 text-xs font-semibold mb-1">NOTES</div>
                  <p className="text-slate-700 text-sm">{booking.studentNotes}</p>
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-2">
                {!!booking.tutorId && (
                  <Link to={`/book/${booking.tutorId}?rescheduleOf=${booking.id}`} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-blue-700">
                    Reschedule
                  </Link>
                )}
                {!!booking.tutorId && (
                  <Link to={`/tutor/${booking.tutorId}`} className="border border-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-slate-50">
                    View Tutor
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </DashboardShell>
    </DashboardLayout>
  );
}

