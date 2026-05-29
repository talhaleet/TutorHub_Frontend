// src/pages/TutorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardShell from '../components/layout/DashboardShell';
import useAuthStore from '../store/authStore';
import { getMyBookings } from '../services/bookingService';
import { getTutorProfile } from '../services/tutorService';
import toast from 'react-hot-toast';

const TutorDashboard = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTutorData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const [bookingsRes, profileRes] = await Promise.all([
          getMyBookings(),
          getTutorProfile(user.id),
        ]);
        setBookings(bookingsRes.data || []);
        setProfile(profileRes?.data ?? null);
      } catch {
        toast.error('Could not load tutor dashboard');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    loadTutorData();
  }, [user?.id]);

  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const completed = bookings.filter((b) => b.status === 'Completed');
  const totalEarnings = completed.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
  const hoursTaught = completed.reduce((sum, b) => sum + (Number(b.durationMinutes) || 0), 0) / 60;

  return (
    <DashboardLayout>
      <DashboardShell>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {user?.firstName || profile?.fullName?.split(' ')[0] || 'Tutor'}!
              </h1>
              <p className="text-slate-500 text-sm">Your tutoring business at a glance — sessions, earnings, and profile.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/dashboard/tutor/profile" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-sm transition-colors shadow-sm">
                Edit Profile
              </Link>
              <Link to={`/tutor/${user?.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl text-sm transition-colors shadow-sm">
                View Public Profile
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Earnings</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">PKR {totalEarnings.toLocaleString()}</h3>
              </div>
              <div className="text-slate-500 text-xs mt-4">From {completed.length} completed session{completed.length !== 1 ? 's' : ''}</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sessions Completed</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{completed.length}</h3>
              </div>
              <div className="text-slate-500 text-xs mt-4">
                {hoursTaught > 0 ? `${hoursTaught.toFixed(1)} hours taught` : 'No completed sessions yet'}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2 flex items-center gap-1.5">
                  {(profile?.averageRating ?? 0).toFixed(1)}
                  <span className="text-amber-500 text-2xl font-normal">★</span>
                </h3>
              </div>
              <div className="text-slate-500 text-xs mt-4">
                From {profile?.totalReviews ?? 0} review{(profile?.totalReviews ?? 0) !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800">Upcoming Tutoring Sessions</h2>
                {pendingCount > 0 && (
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 font-bold rounded-lg text-xs">
                    {pendingCount} Pending Request{pendingCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <span className="text-slate-400 text-sm">No scheduled sessions. Set your availability to receive bookings.</span>
                  <Link to="/dashboard/tutor/availability" className="block mt-3 text-primary text-sm font-bold">
                    Manage Availability →
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3">Student</th>
                        <th className="pb-3">Subject</th>
                        <th className="pb-3">Date & Time</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {bookings.map((booking) => {
                        const statusStyles = {
                          Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                          Pending: 'bg-amber-50 text-amber-700 border-amber-100',
                          Cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
                          Completed: 'bg-blue-50 text-blue-700 border-blue-100',
                        }[booking.status] || 'bg-slate-50 text-slate-600 border-slate-100';

                        return (
                          <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 font-semibold text-slate-800">{booking.studentName}</td>
                            <td className="py-4">
                              <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 rounded text-xs font-bold">{booking.subject}</span>
                            </td>
                            <td className="py-4 text-xs font-mono text-slate-500">{booking.dateTime}</td>
                            <td className="py-4 text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusStyles}`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-3">Profile</h2>
                {profile ? (
                  <div className="text-sm text-slate-600 space-y-2">
                    <p><span className="font-semibold text-slate-800">Headline:</span> {profile.headline || '—'}</p>
                    <p><span className="font-semibold text-slate-800">Rate:</span> PKR {profile.hourlyRateMin?.toLocaleString()} – {profile.hourlyRateMax?.toLocaleString()}/hr</p>
                    <p><span className="font-semibold text-slate-800">City:</span> {profile.city || '—'}</p>
                    <p><span className="font-semibold text-slate-800">Subjects:</span> {(profile.subjectNames || profile.subjects?.map((s) => s.name) || []).join(', ') || 'None added'}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Complete your profile to appear in search.</p>
                )}
                <Link to="/dashboard/tutor/profile" className="mt-4 block text-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm">
                  Edit Profile
                </Link>
              </div>
              <Link to="/dashboard/tutor/earnings" className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm">
                View Earnings
              </Link>
            </div>
          </div>
      </DashboardShell>
    </DashboardLayout>
  );
};

export default TutorDashboard;
