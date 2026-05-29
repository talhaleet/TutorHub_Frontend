// src/pages/TutorProfileEditPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import TutorSidebar from '../components/layout/TutorSidebar';
import { getTutorProfile, updateTutorProfile, uploadDemoVideo, resolveMediaUrl } from '../services/tutorService';
import { getSubjects, getGradeLevels } from '../services/searchService';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const TutorProfileEditPage = () => {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState({
    headline: '',
    bio: '',
    city: 'Lahore',
    hourlyRateMin: 1000,
    hourlyRateMax: 2000,
    teachingMode: 'Online',
    subjects: [],
    selectedSubjectIds: [],
    demoVideoUrl: '',
    education: '',
    experienceYears: 1,
  });

  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const userId = user?.id;
        if (!userId) return;

        const profileRes = await getTutorProfile(userId);
        const subList = await getSubjects();
        const grdList = await getGradeLevels();

        setAvailableSubjects(subList || []);
        setAvailableGrades(grdList || []);

        if (profileRes?.data) {
          const p = profileRes.data;
          const subjectNames = (p.subjects || []).map((s) =>
            typeof s === 'string' ? s : s.name
          );
          const idsFromProfile = (p.subjects || [])
            .map((s) => (typeof s === 'string' ? null : s.id))
            .filter(Boolean);
          const selectedIds = idsFromProfile.length
            ? idsFromProfile
            : (subList || [])
                .filter((s) => subjectNames.includes(s.name))
                .map((s) => s.id);

          setProfile({
            headline: p.headline || '',
            bio: p.bio || '',
            education: p.education || '',
            experienceYears: p.experienceYears || 1,
            city: p.city || 'Lahore',
            hourlyRateMin: p.hourlyRateMin || 1000,
            hourlyRateMax: p.hourlyRateMax || 2000,
            teachingMode: p.teachingMode || 'Online',
            subjects: subjectNames,
            selectedSubjectIds: selectedIds,
            demoVideoUrl: p.demoVideoUrl || '',
          });
        }
      } catch (err) {
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const toggleSubject = (subject) => {
    setProfile((prev) => {
      const has = prev.selectedSubjectIds.includes(subject.id);
      const selectedSubjectIds = has
        ? prev.selectedSubjectIds.filter((id) => id !== subject.id)
        : [...prev.selectedSubjectIds, subject.id];
      const subjects = has
        ? prev.subjects.filter((n) => n !== subject.name)
        : [...prev.subjects, subject.name];
      return { ...prev, selectedSubjectIds, subjects };
    });
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const res = await uploadDemoVideo(file);
      setProfile((prev) => ({ ...prev, demoVideoUrl: res.url }));
      toast.success('Demo video uploaded');
    } catch {
      toast.error('Video upload failed');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        headline: profile.headline,
        bio: profile.bio,
        education: profile.education || 'Not specified',
        experienceYears: Number(profile.experienceYears) || 1,
        city: profile.city,
        hourlyRateMin: Number(profile.hourlyRateMin),
        hourlyRateMax: Number(profile.hourlyRateMax),
        teachingMode: profile.teachingMode,
        demoVideoUrl: profile.demoVideoUrl || null,
        subjects: profile.selectedSubjectIds.map((subjectId) => ({
          subjectId,
          gradeLevelId: null,
        })),
      };
      await updateTutorProfile(payload);
      toast.success('Profile updated successfully!');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="admin-layout">
        <TutorSidebar />
        <div className="screen-area pb-24 md:pb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Edit Tutor Profile</h1>
            <p className="text-slate-500 text-sm">Update your public credentials, bio, rates, and subjects to attract more students.</p>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-slate-500 text-sm mt-3">Loading profile data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Fields */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-3 mb-2">Professional Summary</h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Profile Headline</label>
                  <input
                    type="text"
                    name="headline"
                    value={profile.headline}
                    onChange={handleChange}
                    placeholder="e.g. O-Level Mathematics Specialist with 5+ Years Experience"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Education</label>
                    <input
                      type="text"
                      name="education"
                      value={profile.education}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Years of Experience</label>
                    <input
                      type="number"
                      name="experienceYears"
                      min="0"
                      value={profile.experienceYears}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Bio / Description</label>
                  <textarea
                    name="bio"
                    rows="5"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Tell prospective students about your teaching philosophy, experience, and why they should book your lessons..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">City</label>
                    <select
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Min Hourly Rate (PKR)</label>
                    <input
                      type="number"
                      name="hourlyRateMin"
                      value={profile.hourlyRateMin}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Max Hourly Rate (PKR)</label>
                    <input
                      type="number"
                      name="hourlyRateMax"
                      value={profile.hourlyRateMax}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Teaching Mode</label>
                  <select
                    name="teachingMode"
                    value={profile.teachingMode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Online">Online Sessions Only</option>
                    <option value="InPerson">In-Person Only</option>
                    <option value="Both">Both (Online & In-Person)</option>
                  </select>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Demo Teaching Video</h3>
                {profile.demoVideoUrl ? (
                  <video controls className="w-full max-h-48 rounded-lg mb-3 bg-black" src={resolveMediaUrl(profile.demoVideoUrl)} />
                ) : null}
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer">
                  <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} disabled={uploadingVideo} />
                  {uploadingVideo ? 'Uploading...' : profile.demoVideoUrl ? 'Replace video' : 'Upload demo video'}
                </label>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Subjects Taught</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableSubjects.map((sub) => (
                    <label key={sub.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.selectedSubjectIds.includes(sub.id)}
                        onChange={() => toggleSubject(sub)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-slate-300"
                      />
                      <span>{sub.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving changes...' : 'Save Profile Details'}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default TutorProfileEditPage;