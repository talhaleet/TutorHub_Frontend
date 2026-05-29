import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import TutorSidebar from '../components/layout/TutorSidebar';
import { uploadDocument, getTutorDocuments, resolveMediaUrl } from '../services/tutorService';
import toast from 'react-hot-toast';

const TutorDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState(null);

  const loadDocs = async () => {
    try {
      const docs = await getTutorDocuments();
      setDocuments(docs);
    } catch {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleUpload = async (e, documentType) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingType(documentType);
    try {
      await uploadDocument(file, documentType);
      toast.success('Document uploaded — pending admin review');
      await loadDocs();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Upload failed');
    } finally {
      setUploadingType(null);
      e.target.value = '';
    }
  };

  const statusStyle = (status) =>
    ({
      Pending: 'bg-amber-50 text-amber-700 border-amber-200',
      Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    }[status] || 'bg-slate-50 text-slate-600 border-slate-200');

  const slots = [
    { type: 'GovernmentID', label: 'Government-issued ID', hint: 'CNIC, passport, or national ID (PDF/JPG)' },
    { type: 'Degree', label: 'Degree / Certificate', hint: 'Academic qualification (PDF/JPG)' },
  ];

  return (
    <DashboardLayout>
      <div className="admin-layout">
        <TutorSidebar />
        <div className="screen-area pb-24 md:pb-6 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Credentials & Verification</h1>
            <p className="text-slate-500 text-sm mt-1">Upload identity and qualification documents. An admin will review and approve your tutor account.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {slots.map((slot) => {
              const existing = documents.filter((d) => d.documentType === slot.type);
              return (
                <div key={slot.type} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{slot.label}</h3>
                  <p className="text-xs text-slate-500 mb-4">{slot.hint}</p>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      disabled={uploadingType === slot.type}
                      onChange={(e) => handleUpload(e, slot.type)}
                    />
                    <span className="text-xs font-semibold text-slate-600">
                      {uploadingType === slot.type ? 'Uploading...' : 'Tap to upload'}
                    </span>
                  </label>
                  {existing.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {existing.map((doc) => (
                        <li key={doc.id} className="flex items-center justify-between gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{doc.fileName}</p>
                            <span className={`inline-flex mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${statusStyle(doc.status)}`}>
                              {doc.status}
                            </span>
                          </div>
                          <a
                            href={resolveMediaUrl(doc.fileUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-blue-600 shrink-0"
                          >
                            View
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {loading && (
            <p className="text-center text-slate-400 text-sm mt-6">Loading documents...</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TutorDocumentsPage;
