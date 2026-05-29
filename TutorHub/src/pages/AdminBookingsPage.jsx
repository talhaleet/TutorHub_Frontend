// src/pages/AdminBookingsPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminSidebar from '../components/layout/AdminSidebar';
import { getAdminBookings, cancelAdminBooking } from '../services/adminService';
import toast from 'react-hot-toast';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const loadBookings = async () => {
    try {
      const res = await getAdminBookings();
      setBookings(res.data || []);
    } catch {
      toast.error('Failed to load platform bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!cancelReason.trim()) {
      toast.error('Please enter a cancellation reason.');
      return;
    }
    try {
      await cancelAdminBooking(bookingId, cancelReason);
      toast.success('Session cancelled and refund processed successfully.');
      setCancellingBookingId(null);
      setCancelReason('');
      loadBookings();
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.studentName.toLowerCase().includes(search.toLowerCase()) ||
      b.tutorName.toLowerCase().includes(search.toLowerCase()) ||
      b.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="admin-layout">
        <AdminSidebar />
        <div className="screen-area pb-24 md:pb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Bookings</h1>
            <p className="text-slate-500 text-sm">Monitor all schedules, session state changes, and process cancellations on behalf of students or tutors.</p>
          </div>

          {/* Controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
              </svg>
              <input
                type="text"
                placeholder="Search by student, tutor, or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings Display */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-slate-500 text-sm mt-3">Loading schedules...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-12 text-center bg-slate-50">
                <svg className="w-16 h-16 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-md font-bold text-slate-700">No Sessions Logged</h3>
                <p className="text-slate-400 text-sm mt-1">Adjust filters or search parameters.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4">Booking ID</th>
                      <th className="p-4">Student</th>
                      <th className="p-4">Tutor</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Schedule</th>
                      <th className="p-4">Billing</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredBookings.map((b) => {
                      const badgeStyles = {
                        Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        Pending: 'bg-amber-50 text-amber-700 border-amber-200',
                        Completed: 'bg-blue-50 text-blue-700 border-blue-200',
                        Cancelled: 'bg-slate-100 text-slate-500 border-slate-200'
                      }[b.status] || 'bg-slate-50 text-slate-600 border-slate-200';

                      return (
                        <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="p-4 font-mono text-xs text-slate-400">{b.id}</td>
                          <td className="p-4 font-semibold text-slate-800">{b.studentName}</td>
                          <td className="p-4 text-slate-700 font-semibold">{b.tutorName}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-600 rounded text-xs font-semibold">{b.subject}</span>
                          </td>
                          <td className="p-4 text-slate-500 text-xs">{b.dateTime}</td>
                          <td className="p-4 text-slate-800 font-bold">PKR {b.amount.toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${badgeStyles}`}>
                              {b.status}
                            </span>
                            {b.status === 'Cancelled' && b.cancelReason && (
                              <span className="block text-[10px] text-slate-400 italic mt-0.5 max-w-[150px] truncate" title={b.cancelReason}>
                                Reason: {b.cancelReason}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                              <button
                                onClick={() => setCancellingBookingId(b.id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-bold text-xs py-1.5 px-3 rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Cancellation Confirmation Overlay */}
          {cancellingBookingId && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Cancel Reservation</h3>
                  <p className="text-xs text-slate-400 mt-1">This will release tutor slots and automatically process student refunds.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Cancellation Reason</label>
                  <textarea
                    rows="3"
                    placeholder="Enter reason (e.g. Tutor requested rescheduling due to emergency...)"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50"
                  />
                </div>

                <div className="flex justify-end gap-2 text-xs">
                  <button
                    onClick={() => {
                      setCancellingBookingId(null);
                      setCancelReason('');
                    }}
                    className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-semibold py-2 px-4 rounded-xl transition-colors"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={() => handleCancel(cancellingBookingId)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-5 rounded-xl transition-colors shadow-sm"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminBookingsPage;