// src/pages/AdminTutorApprovalsPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminSidebar from '../components/layout/AdminSidebar';
import { getPendingTutors, approveTutor, rejectTutor } from '../services/adminService';
import toast from 'react-hot-toast';
import { resolveMediaUrl } from '../services/tutorService';

const AdminTutorApprovalsPage = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const loadApps = async () => {
    try {
      const res = await getPendingTutors();
      setApps(res.data || []);
    } catch {
      toast.error('Failed to load pending applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleApprove = async (appId) => {
    try {
      await approveTutor(appId);
      toast.success('Tutor application approved successfully!');
      setSelectedApp(null);
      loadApps();
    } catch {
      toast.error('Failed to approve tutor');
    }
  };

  const handleReject = async (appId) => {
    if (!rejectReason.trim()) {
      toast.error('Please enter a rejection reason.');
      return;
    }
    try {
      await rejectTutor(appId, rejectReason);
      toast.success('Tutor application rejected.');
      setSelectedApp(null);
      setRejectMode(false);
      setRejectReason('');
      loadApps();
    } catch {
      toast.error('Failed to reject tutor');
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-layout">
        <AdminSidebar />
        <div className="screen-area pb-24 md:pb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tutor Verifications</h1>
            <p className="text-slate-500 text-sm">Review uploaded certifications and government IDs to verify tutor expertise and issue trust badges.</p>
          </div>

          {/* Pending Applications List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-slate-500 text-sm mt-3">Loading pending reviews...</p>
              </div>
            ) : apps.length === 0 ? (
              <div className="p-12 text-center bg-slate-50">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-md font-bold text-slate-700">All Caught Up!</h3>
                <p className="text-slate-400 text-sm mt-1">There are no pending tutor applications awaiting approval.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-4">Tutor Candidate</th>
                      <th className="p-4">Subjects</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Applied On</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {apps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-4">
                          <div>
                            <span className="font-semibold text-slate-800">{app.firstName} {app.lastName}</span>
                            <span className="block text-xs text-slate-400 mt-0.5">{app.headline}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {app.subjects.map((sub) => (
                              <span key={sub} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-semibold">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-slate-500">{app.city} ({app.teachingMode})</td>
                        <td className="p-4 text-slate-400">{app.appliedOn}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-lg hover:bg-blue-700 text-xs transition-colors shadow-sm"
                          >
                            Review Docs
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detailed Review Modal */}
          {selectedApp && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Application Review</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Applicant: {selectedApp.firstName} {selectedApp.lastName}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedApp(null);
                      setRejectMode(false);
                      setRejectReason('');
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1 bg-white border border-slate-200 rounded-full"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6 flex-1 space-y-5 text-sm">
                  {/* Headline & Location */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Headline & Profile info</h4>
                    <p className="text-slate-800 font-semibold">{selectedApp.headline}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      Located in <span className="font-semibold text-slate-700">{selectedApp.city}</span> | 
                      Mode: <span className="font-semibold text-slate-700">{selectedApp.teachingMode}</span> | 
                      Billing: <span className="font-semibold text-slate-700">PKR {selectedApp.hourlyRateMin} - {selectedApp.hourlyRateMax}/hr</span>
                    </p>
                  </div>

                  {/* Subjects */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Requested Subjects</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedApp.subjects.map(sub => (
                        <span key={sub} className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-xs font-bold">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Documents Verification */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Verification Documents</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedApp.documents.map(doc => (
                        <div key={doc.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-slate-700 truncate">{doc.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{doc.type}</span>
                          </div>
                          <a
                            href={resolveMediaUrl(doc.url)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-white px-3 py-1.5 border border-slate-200 rounded-lg shadow-sm whitespace-nowrap"
                          >
                            View / Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rejection Mode Interface */}
                  {rejectMode && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                      <label className="block text-xs font-bold text-rose-700 mb-2">Rejection Reason / Feedback to Candidate</label>
                      <textarea
                        rows="3"
                        placeholder="Please type detailed comments detailing what certificates are missing or incorrect..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 text-sm"
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <button
                          onClick={() => setRejectMode(false)}
                          className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReject(selectedApp.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-1.5 px-4.5 rounded-lg text-xs transition-colors shadow-sm"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {!rejectMode && (
                  <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                    <button
                      onClick={() => setRejectMode(true)}
                      className="bg-white hover:bg-rose-50 hover:border-rose-300 border border-slate-200 text-rose-600 font-bold py-2 px-5 rounded-xl text-sm transition-colors"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleApprove(selectedApp.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl text-sm transition-colors shadow-md"
                    >
                      Approve & Verify
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminTutorApprovalsPage;