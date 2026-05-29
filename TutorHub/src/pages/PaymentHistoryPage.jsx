// src/pages/PaymentHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StudentSidebar from '../components/layout/StudentSidebar';
import { getPaymentHistory } from '../services/paymentService';
import toast from 'react-hot-toast';

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const res = await getPaymentHistory();
        setPayments(res.data || []);
      } catch {
        toast.error('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  const filtered = payments.filter(p => {
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchesSearch = searchQuery === '' ||
      p.tutorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalSpent = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'Refunded').reduce((sum, p) => sum + p.amount, 0);

  const statusStyles = {
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Refunded: 'bg-amber-50 text-amber-700 border-amber-100',
    Failed: 'bg-rose-50 text-rose-700 border-rose-100',
    Pending: 'bg-blue-50 text-blue-700 border-blue-100'
  };

  return (
    <DashboardLayout>
      <div className="admin-layout">
        <StudentSidebar />
        <div className="screen-area pb-24 md:pb-6">

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payment History</h1>
            <p className="text-slate-500 text-sm">View and track all your transactions, download receipts, and manage billing.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Spent</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">PKR {totalSpent.toLocaleString()}</h3>
              <span className="text-[10px] text-slate-400">{payments.filter(p => p.status === 'Completed').length} transactions</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Refunded</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">PKR {totalRefunded.toLocaleString()}</h3>
              <span className="text-[10px] text-slate-400">{payments.filter(p => p.status === 'Refunded').length} refunds</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">All Transactions</span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{payments.length}</h3>
              <span className="text-[10px] text-slate-400">Lifetime total</span>
            </div>
          </div>

          {/* Filter & Search */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex gap-2 flex-wrap">
                {['All', 'Completed', 'Refunded', 'Pending'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      filterStatus === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by tutor, subject..."
                  className="h-9 pl-9 pr-4 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-blue-500 transition-colors w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <span className="text-slate-400 text-sm">No transactions found matching your filters.</span>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Booking ID</th>
                      <th className="px-5 py-3">Tutor</th>
                      <th className="px-5 py-3">Subject</th>
                      <th className="px-5 py-3">Method</th>
                      <th className="px-5 py-3 text-right">Amount</th>
                      <th className="px-5 py-3 text-center">Status</th>
                      <th className="px-5 py-3 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                        <td className="px-5 py-4 font-mono text-xs text-slate-500 whitespace-nowrap">{payment.date}</td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{payment.bookingId}</span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-800 whitespace-nowrap">{payment.tutorName}</td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 rounded text-[10px] font-bold">{payment.subject}</span>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">{payment.method}</td>
                        <td className="px-5 py-4 text-right font-extrabold text-slate-900 whitespace-nowrap">PKR {payment.amount.toLocaleString()}</td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusStyles[payment.status] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <button className="text-blue-600 hover:text-blue-700 text-xs font-bold hover:underline transition-colors">
                            <svg className="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentHistoryPage;