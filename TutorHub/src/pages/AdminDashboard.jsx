import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminSidebar from '../components/layout/AdminSidebar';
import { getAdminAnalytics, getPendingTutors } from '../services/adminService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingTutors, setPendingTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const analytics = await getAdminAnalytics();
        const pending = await getPendingTutors();
        setStats(analytics);
        setPendingTutors(pending.data || []);
      } catch (err) {
        if (err?.adminForbidden || err?.response?.status === 403) {
          toast.error('Admin access required. Log in with an Admin account.');
        } else {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const revenueData = stats?.revenueData ?? stats?.RevenueData ?? [];
  const userGrowth = stats?.userGrowth ?? stats?.UserGrowth ?? [];
  const lastRevenue = revenueData.length ? revenueData[revenueData.length - 1] : null;
  const lastGrowth = userGrowth.length ? userGrowth[userGrowth.length - 1] : null;

  const totalRevenue30d = revenueData.reduce(
    (sum, r) => sum + Number(r.revenue ?? r.Revenue ?? 0),
    0
  );
  const activeTutors = lastGrowth
    ? Number(lastGrowth.tutors ?? lastGrowth.Tutors ?? 0)
    : 0;
  const totalStudents = lastGrowth
    ? Number(lastGrowth.students ?? lastGrowth.Students ?? 0)
    : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="admin-layout">
          <AdminSidebar />
          <div className="screen-area flex items-center justify-center min-h-[50vh]">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <span className="ml-2 text-slate-500 font-semibold text-sm">Loading dashboard...</span>
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
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Admin Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Live metrics from your database.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue (6 mo)</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                PKR {totalRevenue30d.toLocaleString()}
              </h3>
              {lastRevenue && (
                <p className="text-slate-500 text-xs mt-3">
                  Last month: PKR {Number(lastRevenue.revenue ?? lastRevenue.Revenue ?? 0).toLocaleString()}
                </p>
              )}
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tutors</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{activeTutors}</h3>
              <p className="text-amber-600 text-xs font-semibold mt-3">
                {pendingTutors.length} pending verification
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm sm:col-span-2 lg:col-span-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{totalStudents}</h3>
              <p className="text-slate-500 text-xs mt-3">Registered student accounts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-slate-800">Pending Tutor Approvals</h2>
                <Link to="/admin/approvals" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                  View all
                </Link>
              </div>

              {pendingTutors.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <span className="text-slate-400 text-sm">No pending tutor verification requests.</span>
                </div>
              ) : (
                <div className="table-responsive -mx-1">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                        <th className="pb-3 pr-2">Name</th>
                        <th className="pb-3 pr-2 hidden sm:table-cell">Headline</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingTutors.slice(0, 5).map((tutor) => (
                        <tr key={tutor.id}>
                          <td className="py-3 font-semibold text-slate-800">
                            {tutor.firstName} {tutor.lastName}
                          </td>
                          <td className="py-3 text-slate-500 truncate max-w-[180px] hidden sm:table-cell">
                            {tutor.headline}
                          </td>
                          <td className="py-3 text-right">
                            <Link
                              to="/admin/approvals"
                              className="inline-flex bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-lg text-xs"
                            >
                              Review
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Quick actions</h2>
              <div className="flex flex-col gap-2">
                {[
                  { to: '/admin/users', title: 'Manage users', desc: 'Roles & status' },
                  { to: '/admin/subjects', title: 'Subjects & grades', desc: 'Platform catalog' },
                  { to: '/admin/analytics', title: 'Analytics', desc: 'Charts & reports' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
                  >
                    <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
