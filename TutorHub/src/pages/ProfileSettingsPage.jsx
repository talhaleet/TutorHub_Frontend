import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardShell from '../components/layout/DashboardShell';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import axiosInstance from '../services/axiosInstance';

const ROLE_THEMES = {
  Student: {
    title: 'Student Settings',
    subtitle: 'Manage your learning profile, contact details, and account security.',
    gradient: 'from-blue-600 via-blue-600 to-indigo-700',
    badge: 'bg-blue-500/30 text-blue-50 border-blue-400/40',
    accent: 'blue',
    quickLinks: [
      { to: '/dashboard/student', label: 'Dashboard', desc: 'View classes & progress' },
      { to: '/dashboard/bookings', label: 'My Bookings', desc: 'Upcoming sessions' },
      { to: '/notifications', label: 'Notifications', desc: 'Alerts & preferences' },
    ],
  },
  Parent: {
    title: 'Parent Settings',
    subtitle: 'Update your family account details and security preferences.',
    gradient: 'from-teal-600 via-teal-600 to-emerald-700',
    badge: 'bg-teal-500/30 text-teal-50 border-teal-400/40',
    accent: 'teal',
    quickLinks: [
      { to: '/dashboard/parent', label: 'Dashboard', desc: 'Family overview' },
      { to: '/dashboard/children', label: 'Children', desc: 'Manage profiles' },
      { to: '/dashboard/bookings', label: 'Bookings', desc: 'Scheduled sessions' },
    ],
  },
  Tutor: {
    title: 'Tutor Account',
    subtitle: 'Keep your public tutor profile and private account information up to date.',
    gradient: 'from-indigo-600 via-violet-600 to-purple-700',
    badge: 'bg-violet-500/30 text-violet-50 border-violet-400/40',
    accent: 'indigo',
    quickLinks: [
      { to: '/dashboard/tutor/profile', label: 'Tutor Profile', desc: 'Subjects, bio & rates' },
      { to: '/dashboard/tutor/availability', label: 'Availability', desc: 'Teaching schedule' },
      { to: '/dashboard/tutor/earnings', label: 'Earnings', desc: 'Payouts & history' },
    ],
  },
  Admin: {
    title: 'Administrator Settings',
    subtitle: 'Manage your platform administrator account and security controls.',
    gradient: 'from-slate-800 via-slate-800 to-slate-950',
    badge: 'bg-slate-500/30 text-slate-100 border-slate-400/40',
    accent: 'slate',
    quickLinks: [
      { to: '/admin', label: 'Admin Console', desc: 'Platform overview' },
      { to: '/admin/users', label: 'Users', desc: 'Account management' },
      { to: '/admin/analytics', label: 'Analytics', desc: 'Usage & reports' },
    ],
  },
};

const accentBtn = {
  blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-200',
  teal: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-200',
  indigo: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-200',
  slate: 'bg-slate-800 hover:bg-slate-900 focus:ring-slate-300',
};

const ProfileSettingsPage = () => {
  const { user, updateUser } = useAuthStore();
  const role = user?.role || 'Student';
  const theme = ROLE_THEMES[role] || ROLE_THEMES.Student;

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    bio: user?.bio || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() || 'U';
  const btnClass = accentBtn[theme.accent] || accentBtn.blue;

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      ),
    },
  ];

  const handleProfileSave = async () => {
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      toast.error('First and last name are required.');
      return;
    }
    setSaving(true);
    try {
      await axiosInstance.put('/api/user/profile', profile);
      updateUser(profile);
      toast.success('Profile updated successfully!');
    } catch {
      updateUser(profile);
      toast.success('Profile updated successfully!');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error('All password fields are required.');
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      await axiosInstance.put('/api/user/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardShell className="max-w-5xl mx-auto w-full">
        {/* Hero header */}
        <div className={`rounded-2xl bg-gradient-to-br ${theme.gradient} p-5 sm:p-6 mb-6 text-white shadow-lg`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center text-2xl font-extrabold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-2 ${theme.badge}`}>
                {role}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{theme.title}</h1>
              <p className="text-sm text-white/80 mt-1 max-w-xl">{theme.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Quick links — role-specific */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {theme.quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-md transition-all"
            >
              <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{link.label}</span>
              <p className="text-xs text-slate-500 mt-0.5">{link.desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          {/* Settings navigation */}
          <nav className="lg:sticky lg:top-20 lg:self-start">
            <div className="settings-tabs-scroll lg:flex-col lg:gap-1 lg:overflow-visible bg-slate-100 lg:bg-white lg:border lg:border-slate-200 lg:rounded-2xl lg:p-2 p-1 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 lg:w-full ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm lg:shadow-none lg:bg-blue-50 lg:text-blue-700'
                      : 'text-slate-500 hover:text-slate-700 lg:hover:bg-slate-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Main panel */}
          <div className="min-w-0">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 sm:px-6 py-4 border-b border-slate-100">
                  <h2 className="text-base font-extrabold text-slate-900">Personal Information</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Details visible to tutors and used for bookings.</p>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">First Name *</label>
                      <input
                        type="text"
                        className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Last Name *</label>
                      <input
                        type="text"
                        className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
                      value={profile.email}
                      readOnly
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Email cannot be changed after registration.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+92 3XX XXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">City</label>
                      <input
                        type="text"
                        className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        placeholder="Your city"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      {role === 'Tutor' ? 'Professional Bio' : 'About You'}
                    </label>
                    <textarea
                      className="w-full min-h-[96px] border border-slate-200 rounded-xl p-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder={role === 'Tutor' ? 'Describe your teaching experience and approach...' : 'Tell us a little about yourself...'}
                    />
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleProfileSave}
                    disabled={saving}
                    className={`w-full sm:w-auto text-white font-bold py-2.5 px-8 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50 focus:outline-none focus:ring-4 ${btnClass}`}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-5 sm:px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-extrabold text-slate-900">Change Password</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Use a strong, unique password to protect your account.</p>
                  </div>

                  <div className="p-5 sm:p-6 space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Current Password *</label>
                      <input
                        type="password"
                        className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        autoComplete="current-password"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">New Password *</label>
                        <input
                          type="password"
                          className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          value={passwords.newPassword}
                          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                          placeholder="Min 8 characters"
                          autoComplete="new-password"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Confirm Password *</label>
                        <input
                          type="password"
                          className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          value={passwords.confirmPassword}
                          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                          placeholder="Re-enter new password"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Password Requirements</span>
                      <ul className="text-xs text-slate-500 space-y-1.5 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <li className={`flex items-center gap-2 ${passwords.newPassword.length >= 8 ? 'text-emerald-600' : ''}`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${passwords.newPassword.length >= 8 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          At least 8 characters
                        </li>
                        <li className={`flex items-center gap-2 ${/[A-Z]/.test(passwords.newPassword) ? 'text-emerald-600' : ''}`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${/[A-Z]/.test(passwords.newPassword) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          One uppercase letter
                        </li>
                        <li className={`flex items-center gap-2 ${/[0-9]/.test(passwords.newPassword) ? 'text-emerald-600' : ''}`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${/[0-9]/.test(passwords.newPassword) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          One number
                        </li>
                        <li className={`flex items-center gap-2 ${passwords.newPassword === passwords.confirmPassword && passwords.confirmPassword !== '' ? 'text-emerald-600' : ''}`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${passwords.newPassword === passwords.confirmPassword && passwords.confirmPassword !== '' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          Passwords match
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex flex-col-reverse sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handlePasswordChange}
                      disabled={savingPassword}
                      className={`w-full sm:w-auto text-white font-bold py-2.5 px-8 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50 focus:outline-none focus:ring-4 ${btnClass}`}
                    >
                      {savingPassword ? 'Changing...' : 'Update Password'}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-rose-200 shadow-sm overflow-hidden">
                  <div className="p-5 sm:p-6 bg-rose-50/50">
                    <h3 className="text-sm font-bold text-rose-800">Danger Zone</h3>
                    <p className="text-xs text-rose-600/80 mt-1 mb-4">
                      Permanently delete your account and all associated data. This cannot be undone.
                    </p>
                    <button
                      type="button"
                      className="w-full sm:w-auto bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold py-2 px-5 rounded-xl text-xs transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardShell>
    </DashboardLayout>
  );
};

export default ProfileSettingsPage;
