// src/pages/ChildProfilesPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StudentSidebar from '../components/layout/StudentSidebar';
import { getChildrenProfiles, addChildProfile, updateChildProfile, deleteChildProfile } from '../services/studentService';
import toast from 'react-hot-toast';

const GRADE_LEVELS = ['Primary (Grade 1-5)', 'Secondary (Grade 6-10)', 'Intermediate (Grade 11-12)', 'O-Level', 'A-Level'];
const SUBJECT_OPTIONS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Computer Science', 'General Science', 'Islamiat', 'Pakistan Studies'];

const emptyForm = { name: '', age: '', gradeLevel: '', subjects: [] };

const ChildProfilesPage = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadChildren = async () => {
    try {
      const res = await getChildrenProfiles();
      setChildren(res.data || []);
    } catch {
      toast.error('Failed to load children profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadChildren(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (child) => {
    setEditingId(child.id);
    setForm({ name: child.name, age: child.age, gradeLevel: child.gradeLevel, subjects: child.subjects || [] });
    setShowModal(true);
  };

  const toggleSubject = (sub) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(sub) ? prev.subjects.filter(s => s !== sub) : [...prev.subjects, sub]
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.age || !form.gradeLevel) {
      toast.error('Please fill in name, age, and grade level.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateChildProfile(editingId, form);
        toast.success('Child profile updated!');
      } else {
        await addChildProfile(form);
        toast.success('Child profile added!');
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadChildren();
    } catch {
      toast.error('Failed to save child profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this child profile?')) return;
    try {
      await deleteChildProfile(id);
      toast.success('Child profile removed');
      await loadChildren();
    } catch {
      toast.error('Failed to delete profile');
    }
  };

  const childColors = ['from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600', 'from-rose-500 to-pink-600', 'from-violet-500 to-purple-600'];

  return (
    <DashboardLayout>
      <div className="admin-layout">
        <StudentSidebar />
        <div className="screen-area pb-24 md:pb-6">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Children Profiles</h1>
              <p className="text-slate-500 text-sm">Add and manage your children's learning profiles for booking tutoring sessions.</p>
            </div>
            <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-sm whitespace-nowrap flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Child
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : children.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Children Profiles Yet</h3>
              <p className="text-slate-400 text-sm mb-4">Add your children to start booking tutoring sessions for them.</p>
              <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors">
                + Add Your First Child
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {children.map((child, idx) => (
                <div key={child.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {/* Card Header */}
                  <div className={`bg-gradient-to-br ${childColors[idx % childColors.length]} p-5 text-white`}>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-extrabold border-2 border-white/30">
                        {child.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold">{child.name}</h3>
                        <span className="text-white/70 text-xs font-medium">Age {child.age}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grade Level</span>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">{child.gradeLevel}</p>
                    </div>

                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subjects</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {(child.subjects || []).length > 0 ? child.subjects.map(sub => (
                          <span key={sub} className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold rounded-full">{sub}</span>
                        )) : (
                          <span className="text-xs text-slate-400 italic">No subjects added</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-slate-100">
                      <button onClick={() => openEdit(child)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-lg text-xs transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(child.id)} className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-2 rounded-lg text-xs transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Card */}
              <button onClick={openAdd} className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 shadow-sm transition-all p-8 flex flex-col items-center justify-center gap-3 min-h-[240px] cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <span className="font-bold text-sm text-slate-400 group-hover:text-blue-600 transition-colors">Add Another Child</span>
              </button>
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowModal(false)}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-extrabold text-slate-900">{editingId ? 'Edit Child Profile' : 'Add New Child'}</h2>
                  <p className="text-sm text-slate-500 mt-1">Fill in the details below for your child's learning profile.</p>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Child's Full Name *</label>
                    <input
                      type="text"
                      className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="Enter child's name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Age *</label>
                      <input
                        type="number"
                        min="3"
                        max="20"
                        className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="Age"
                        value={form.age}
                        onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || '' })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Grade Level *</label>
                      <select
                        className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                        value={form.gradeLevel}
                        onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
                      >
                        <option value="">Select grade</option>
                        {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">Subjects Needed</label>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECT_OPTIONS.map(sub => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => toggleSubject(sub)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            form.subjects.includes(sub)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-sm">
                    {saving ? 'Saving...' : editingId ? 'Update Profile' : 'Add Child'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChildProfilesPage;