// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardShell from '../components/layout/DashboardShell';
import { getStudentStats } from '../services/studentService';
import { getMyBookings } from '../services/bookingService';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const statsRes = await getStudentStats();
        const bookingsRes = await getMyBookings();
        setStats(statsRes);
        setBookings(bookingsRes.data || []);
      } catch {
        toast.error('Could not load dashboard data');
        setStats(null);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    loadStudentData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardShell>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Dashboard</h1>
              <p className="text-slate-500 text-sm">Track your learning progress, join live classes, and manage bookings.</p>
            </div>
            <Link to="/search" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-sm whitespace-nowrap">
              Find New Tutors
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hours Studied</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats?.hoursLearned || 0} hrs</h3>
              </div>
              <div className="text-slate-500 text-xs mt-4">
                <span>Across {stats?.favoriteSubjects?.length || 0} subject areas</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Sessions</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats?.sessionsCompleted || 0}</h3>
              </div>
              <div className="text-emerald-600 text-xs font-bold mt-4">
                <span>100% attendance rate</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Tutor Rating</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2 flex items-center gap-1.5">
                  {stats?.avgTutorRating || 0.0} <span className="text-amber-500 text-2xl font-normal">★</span>
                </h3>
              </div>
              <div className="text-slate-500 text-xs mt-4">
                <span>Highest rate reviews sent</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Sessions */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Your Upcoming Classes</h2>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                  <span className="text-slate-400 text-sm">No upcoming classes. Find a tutor and start scheduling today!</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const isConfirmed = booking.status === 'Confirmed';
                    return (
                      <div key={booking.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-800 text-sm">{booking.tutorName}</h4>
                            <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 rounded text-[10px] font-bold">{booking.subject}</span>
                          </div>
                          <span className="block text-xs text-slate-400 font-mono mt-1">🗓 {booking.dateTime}</span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {isConfirmed && booking.meetLink ? (
                            <a
                              href={booking.meetLink}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded-lg text-xs transition-colors shadow-sm"
                            >
                              Join Online Class
                            </a>
                          ) : (
                            <span className="inline-flex px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-bold">
                              Awaiting Confirmation
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Favorite subjects */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Favorite Topics</h2>
              <div className="flex flex-wrap gap-2">
                {(stats?.favoriteSubjects || []).map((sub) => (
                  <span key={sub} className="px-3 py-1.5 bg-blue-50/50 border border-blue-100/60 text-blue-700 rounded-xl text-xs font-bold">
                    {sub}
                  </span>
                ))}
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="block font-bold text-slate-700 mb-1">Need help with study?</span>
                <p className="text-slate-500 leading-relaxed">Book a recurring weekly study slot with one of our O/A level experts for intensive preparation.</p>
              </div>
            </div>
          </div>

      </DashboardShell>
    </DashboardLayout>
  );
};

export default StudentDashboard;