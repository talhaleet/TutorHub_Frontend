import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import TutorSidebar from '../components/layout/TutorSidebar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMyBookings } from '../services/bookingService';
import toast from 'react-hot-toast';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const TutorEarningsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyBookings();
        setBookings(res?.data || []);
      } catch {
        toast.error('Could not load earnings from bookings');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const paidBookings = useMemo(
    () =>
      bookings.filter((b) => {
        const status = (b.status || b.Status || '').toLowerCase();
        return status === 'completed' || status === 'confirmed' || status === 'paid';
      }),
    [bookings]
  );

  const gross = useMemo(
    () => paidBookings.reduce((sum, b) => sum + Number(b.totalAmount ?? b.TotalAmount ?? 0), 0),
    [paidBookings]
  );

  const commission = Math.round(gross * 0.1);
  const net = gross - commission;

  const chartData = useMemo(() => {
    const byMonth = {};
    paidBookings.forEach((b) => {
      const dateStr = b.scheduledDate || b.ScheduledDate || b.createdAt || b.CreatedAt;
      if (!dateStr) return;
      const d = new Date(dateStr);
      const key = MONTHS[d.getMonth()];
      const amount = Number(b.totalAmount ?? b.TotalAmount ?? 0) * 0.9;
      byMonth[key] = (byMonth[key] || 0) + amount;
    });
    const now = new Date();
    const lastSix = [];
    for (let i = 5; i >= 0; i--) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = MONTHS[m.getMonth()];
      lastSix.push({ month: label, earnings: byMonth[label] || 0 });
    }
    return lastSix;
  }, [paidBookings]);

  const history = useMemo(
    () =>
      [...paidBookings]
        .sort(
          (a, b) =>
            new Date(b.scheduledDate || b.ScheduledDate || 0) - new Date(a.scheduledDate || a.ScheduledDate || 0)
        )
        .slice(0, 8)
        .map((b) => ({
          id: String(b.id ?? b.Id),
          date: String(b.scheduledDate || b.ScheduledDate || b.createdAt || b.CreatedAt || '').split('T')[0] || '—',
          method: b.subject || b.Subject || 'Session',
          status: 'Completed',
          amount: Math.round(Number(b.totalAmount ?? b.TotalAmount ?? 0) * 0.9),
        })),
    [paidBookings]
  );

  return (
    <DashboardLayout>
      <div className="admin-layout">
        <TutorSidebar />
        <div className="screen-area pb-24 md:pb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Earnings & Payouts</h1>
            <p className="text-slate-500 text-sm">
              Based on your completed bookings from the database (10% platform fee applied to net figures).
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Loading earnings...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Earnings</span>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-2">PKR {net.toLocaleString()}</h3>
                  <p className="text-xs text-slate-400 mt-3">After 10% platform fee</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Income</span>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-2">PKR {gross.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Commission (10%)</span>
                  <h3 className="text-3xl font-extrabold text-rose-600 mt-2">PKR {commission.toLocaleString()}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
                  <h3 className="text-md font-bold text-slate-800 mb-1">Income by month</h3>
                  <p className="text-xs text-slate-400 mb-4">Net tutor income from paid sessions</p>
                  <div className="h-64 w-full">
                    {chartData.every((d) => d.earnings === 0) ? (
                      <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                        No completed bookings yet
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorEarn" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                          <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                          <Tooltip formatter={(value) => [`PKR ${Number(value).toLocaleString()}`, 'Net']} />
                          <Area type="monotone" dataKey="earnings" stroke="#10B981" strokeWidth={2} fill="url(#colorEarn)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-md font-bold text-slate-800 mb-4">Recent sessions</h3>
                  {history.length === 0 ? (
                    <p className="text-sm text-slate-400">No completed sessions yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {history.map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 text-xs">
                          <div>
                            <div className="font-bold text-slate-700">{tx.method}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{tx.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-extrabold text-slate-800">PKR {tx.amount.toLocaleString()}</div>
                            <span className="text-[9px] font-bold text-emerald-500">{tx.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TutorEarningsPage;
