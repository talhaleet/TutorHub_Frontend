// src/pages/AdminAnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminSidebar from '../components/layout/AdminSidebar';
import { getAdminAnalytics } from '../services/adminService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#1A6FE6', '#0EA9A1', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981'];

const AdminAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await getAdminAnalytics();
        setData(res);
      } catch {
        toast.error('Failed to load platform analytics');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="admin-layout">
          <AdminSidebar />
          <div className="screen-area flex items-center justify-center min-h-[60vh]">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-slate-500 font-semibold">Generating reports...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="admin-layout">
        <AdminSidebar />
        <div className="screen-area pb-24 md:pb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Analytics</h1>
            <p className="text-slate-500 text-sm">Visualize user acquisition curves, monthly revenue breakdowns, subject popularities, and top tutors.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-md font-bold text-slate-800 mb-1">Monthly Gross Revenue</h3>
                <p className="text-xs text-slate-400 mb-4">Total transaction value processed on TutorHub (PKR).</p>
              </div>
              <div className="h-72 min-h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={280}>
                  <AreaChart data={data?.revenueData ?? data?.RevenueData ?? []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1A6FE6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1A6FE6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip formatter={(value) => [`PKR ${value.toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#1A6FE6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Acquisition Growth */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-md font-bold text-slate-800 mb-1">User Growth Trajectory</h3>
                <p className="text-xs text-slate-400 mb-4">New user account signups broken down by role.</p>
              </div>
              <div className="h-72 min-h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={280}>
                  <BarChart data={data?.userGrowth ?? data?.UserGrowth ?? []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="students" fill="#1A6FE6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="tutors" fill="#0EA9A1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="parents" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject Breakdown Pie Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between lg:col-span-1">
              <div>
                <h3 className="text-md font-bold text-slate-800 mb-1">Booking Share by Subject</h3>
                <p className="text-xs text-slate-400 mb-4">Volume distribution across the top subjects.</p>
              </div>
              <div className="h-56 min-h-[224px] w-full min-w-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={224}>
                  <PieChart>
                    <Pie
                      data={data?.subjectVolume ?? data?.SubjectVolume ?? []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {(data?.subjectVolume || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} sessions`, 'Bookings']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold mt-4">
                {(data?.subjectVolume || []).slice(0, 4).map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="truncate">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Tutors */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
              <div className="mb-4">
                <h3 className="text-md font-bold text-slate-800 mb-1">Top Performing Tutors</h3>
                <p className="text-xs text-slate-400">Tutors ranked by completed session volume and ratings.</p>
              </div>
              <div className="table-responsive">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Completed Hours</th>
                      <th className="pb-3">Rating</th>
                      <th className="pb-3 text-right">Tutor Earnings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {(data?.topTutors || []).map((tutor) => (
                      <tr key={tutor.name} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 font-semibold text-slate-800">{tutor.name}</td>
                        <td className="py-3 font-mono">{tutor.hours} hrs</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded">
                            {tutor.rating} ★
                          </span>
                        </td>
                        <td className="py-3 text-right font-extrabold text-slate-800">PKR {tutor.earnings.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalyticsPage;