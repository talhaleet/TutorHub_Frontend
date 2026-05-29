// src/pages/ParentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardShell from '../components/layout/DashboardShell';
import { getParentStats, getChildrenProfiles } from '../services/studentService';
import { getMyBookings } from '../services/bookingService';
import toast from 'react-hot-toast';

const ParentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [children, setChildren] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, childrenRes, bookingsRes] = await Promise.all([
          getParentStats(),
          getChildrenProfiles(),
          getMyBookings(),
        ]);
        setStats(statsRes?.data ?? statsRes);
        setChildren(childrenRes.data || []);
        setBookings(bookingsRes.data || []);
      } catch {
        toast.error('Could not load dashboard data');
        setStats(null);
        setChildren([]);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const childColors = ['bg-gradient-to-br from-blue-500 to-indigo-600', 'bg-gradient-to-br from-emerald-500 to-teal-600', 'bg-gradient-to-br from-amber-500 to-orange-600', 'bg-gradient-to-br from-rose-500 to-pink-600'];

  return (
    <DashboardLayout>
      <DashboardShell>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Parent Dashboard</h1>
              <p className="text-slate-500 text-sm">Monitor your children's learning progress, manage profiles, and track sessions.</p>
            </div>
            <Link to="/dashboard/children" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-sm whitespace-nowrap">
              Manage Children
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Spending</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">PKR {(stats?.totalSpending || 0).toLocaleString()}</h3>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hours Learned</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.hoursLearnedTotal || 0} hrs</h3>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Sessions</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.activeSessionsCount || 0}</h3>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Children Registered</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.childrenRegistered ?? children.length}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-slate-800">Children Profiles</h2>
                <Link to="/dashboard/children" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Manage All
                </Link>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
              ) : children.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <span className="text-slate-400 text-sm">No children profiles added yet.</span>
                  <Link to="/dashboard/children" className="block mt-3 text-blue-600 text-sm font-bold">+ Add Child Profile</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {children.map((child, idx) => (
                    <div key={child.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-11 h-11 rounded-full ${childColors[idx % childColors.length]} flex items-center justify-center text-white text-sm font-extrabold shadow-sm`}>
                          {child.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-sm">{child.name}</h4>
                          <span className="text-[10px] text-slate-400">{child.gradeLevel} • Age {child.age}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(child.subjects || []).map((sub) => (
                          <span key={sub} className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold rounded-full">{sub}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Upcoming Sessions</h2>
              {loading ? (
                <div className="p-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <span className="text-slate-400 text-xs">No upcoming sessions.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {bookings.slice(0, 5).map((booking) => {
                    const statusStyle = {
                      Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                      Pending: 'bg-amber-50 text-amber-700 border-amber-100',
                      Cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
                    }[booking.status] || 'bg-slate-50 text-slate-600 border-slate-100';

                    return (
                      <div key={booking.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/30">
                        <div className="flex items-start justify-between mb-1.5">
                          <h4 className="font-bold text-slate-800 text-sm">{booking.studentName}</h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle}`}>
                            {booking.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span className="px-1.5 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 rounded text-[9px] font-bold">{booking.subject}</span>
                          with {booking.tutorName}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-1">🗓 {booking.dateTime}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <Link to="/dashboard/bookings" className="mt-4 block text-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm">
                View All Bookings
              </Link>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold">Find a Tutor for Your Child</h3>
                <p className="text-blue-100 text-sm mt-1">Browse our network of verified, expert tutors in over 40 subjects.</p>
              </div>
              <Link to="/search" className="bg-white text-blue-600 font-bold py-2.5 px-6 rounded-xl text-sm hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap">
                Browse Tutors
              </Link>
            </div>
          </div>
      </DashboardShell>
    </DashboardLayout>
  );
};

export default ParentDashboard;
