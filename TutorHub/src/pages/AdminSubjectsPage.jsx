// src/pages/AdminSubjectsPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminSidebar from '../components/layout/AdminSidebar';
import { getSubjectsList, addSubject, deleteSubject, getGradeLevelsList, addGradeLevel, deleteGradeLevel } from '../services/adminService';
import toast from 'react-hot-toast';

const AdminSubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newSub, setNewSub] = useState('');
  const [newGrade, setNewGrade] = useState('');

  const loadData = async () => {
    try {
      const subs = await getSubjectsList();
      const grds = await getGradeLevelsList();
      setSubjects(subs || []);
      setGrades(grds || []);
    } catch {
      toast.error('Failed to load subjects and grade levels configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSub.trim()) return;
    try {
      await addSubject(newSub.trim());
      toast.success('Subject added successfully');
      setNewSub('');
      loadData();
    } catch {
      toast.error('Failed to add subject');
    }
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    if (!newGrade.trim()) return;
    try {
      await addGradeLevel(newGrade.trim());
      toast.success('Grade level added');
      setNewGrade('');
      loadData();
    } catch {
      toast.error('Failed to add grade level');
    }
  };

  const handleDeleteSubject = async (subName) => {
    if (!window.confirm(`Are you sure you want to delete "${subName}"?`)) return;
    try {
      await deleteSubject(subName);
      toast.success('Subject removed');
      loadData();
    } catch {
      toast.error('Failed to delete subject');
    }
  };

  const handleDeleteGrade = async (gradeName) => {
    if (!window.confirm(`Are you sure you want to delete "${gradeName}"?`)) return;
    try {
      await deleteGradeLevel(gradeName);
      toast.success('Grade level removed');
      loadData();
    } catch {
      toast.error('Failed to delete grade level');
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-layout">
        <AdminSidebar />
        <div className="screen-area pb-24 md:pb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Configurations</h1>
            <p className="text-slate-500 text-sm">Add or remove subjects and grade levels that appear inside tutor profiles and student search pages.</p>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-slate-500 text-sm mt-3">Loading taxonomies...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Subjects Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">Subject Areas</h2>
                  <p className="text-xs text-slate-400 mb-4">Manage academic and technical subjects.</p>

                  <form onSubmit={handleAddSubject} className="flex gap-2 mb-6">
                    <input
                      type="text"
                      placeholder="Add new (e.g. Sociology, Economics)..."
                      value={newSub}
                      onChange={(e) => setNewSub(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-sm whitespace-nowrap">
                      Add Subject
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2">
                    {subjects.map((sub) => (
                      <span key={sub} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all">
                        {sub}
                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(sub)}
                          className="text-blue-400 hover:text-rose-600 font-bold p-0.5 rounded-full"
                          title="Remove subject"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grade Levels Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">Grade Levels</h2>
                  <p className="text-xs text-slate-400 mb-4">Manage levels covered on the platform.</p>

                  <form onSubmit={handleAddGrade} className="flex gap-2 mb-6">
                    <input
                      type="text"
                      placeholder="Add new (e.g. Middle School, IGCSE)..."
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-sm whitespace-nowrap">
                      Add Grade
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2">
                    {grades.map((grade) => (
                      <span key={grade} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all">
                        {grade}
                        <button
                          type="button"
                          onClick={() => handleDeleteGrade(grade)}
                          className="text-indigo-400 hover:text-rose-600 font-bold p-0.5 rounded-full"
                          title="Remove grade level"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSubjectsPage;