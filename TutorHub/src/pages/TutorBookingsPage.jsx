// src/pages/TutorBookingsPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardShell from '../components/layout/DashboardShell';
import { cancelBooking, confirmBooking, getMyBookings } from '../services/bookingService';
import toast from 'react-hot-toast';

const TABS = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const statusBadge = (status) => {
  const styles = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-100',
    Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Completed: 'bg-blue-50 text-blue-700 border-blue-100',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
  }[status] || 'bg-slate-50 text-slate-600 border-slate-100';
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles}`;
};

const TutorBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending');

  const loadBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res.data || []);
    } catch {
      toast.error('Could not load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filtered = useMemo(
    () => bookings.filter((b) => b.status === activeTab),
    [bookings, activeTab]
  );

  const handleConfirm = async (bookingId) => {
    try {
      await confirmBooking(bookingId);
      toast.success('Booking confirmed.');
      loadBookings();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not confirm booking');
    }
  };

  const handleReject = async (bookingId) => {
    const reason = window.prompt('Please enter a cancellation reason:');
    if (reason === null) return;
    try {
      await cancelBooking(bookingId, reason);
      toast.success('Booking cancelled.');
      loadBookings();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not cancel booking');
    }
  };

  return (
    <DashboardLayout>
      <DashboardShell>
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Bookings</h1>
          <p className="text-slate-500 text-sm">Confirm or cancel requests, and review your schedule.</p>
        </div>

        <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto">
          {TABS.map((tab) => {
            const count = bookings.filter((b) => b.status === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold transition-all border-b-2 -mb-[2px] whitespace-nowrap ${
                  isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
            <p className="text-slate-400 font-semibold">No bookings in “{activeTab}”.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => (
              <div key={b.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 truncate">{b.studentName}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 rounded text-[10px] font-bold">
                        {b.subject}
                      </span>
                      <span className="ml-2 font-mono text-slate-400">{b.dateTime}</span>
                    </div>
                  </div>
                  <span className={statusBadge(b.status)}>{b.status}</span>
                </div>

                {b.status === 'Pending' && (
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleReject(b.id)}
                      className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirm(b.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DashboardShell>
    </DashboardLayout>
  );
};

export default TutorBookingsPage;

