// src/pages/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardShell from '../components/layout/DashboardShell';
import { getNotifications, markNotificationRead, markAllNotificationsRead, getNotificationPreferences, saveNotificationPreferences } from '../services/notificationService';
import toast from 'react-hot-toast';
import { subscribeChatHub, getChatHubConnection } from '../services/chatHubClient';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inbox');
  const [filterType, setFilterType] = useState('All');
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [notifRes, prefsRes] = await Promise.all([
          getNotifications(),
          getNotificationPreferences()
        ]);
        setNotifications(notifRes.data || []);
        setPrefs(prefsRes);
      } catch {
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    loadData();
    getChatHubConnection().catch(() => {});

    const unsub = subscribeChatHub('ReceiveNotification', (payload) => {
      setNotifications((prev) => [
        {
          id: `live-${Date.now()}`,
          title: payload.title ?? 'Notification',
          message: payload.message ?? '',
          type: payload.type ?? 'System',
          isRead: false,
          date: payload.date ?? new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
    });

    return () => unsub();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const handleSavePrefs = async () => {
    setSavingPrefs(true);
    try {
      await saveNotificationPreferences(prefs);
      toast.success('Notification preferences saved!');
    } catch {
      toast.error('Failed to save preferences');
    } finally {
      setSavingPrefs(false);
    }
  };

  const togglePref = (category, key) => {
    setPrefs(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filtered = notifications.filter(n => filterType === 'All' || n.type === filterType);

  const typeStyles = {
    Booking: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    )},
    Chat: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    )},
    Payment: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    )},
    System: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
    )}
  };

  const prefLabels = {
    email: {
      welcome: 'Welcome emails',
      verification: 'Email verification reminders',
      bookingRequests: 'New booking requests',
      bookingConfirmations: 'Booking confirmations',
      bookingCancellations: 'Booking cancellations',
      newMessages: 'New chat messages',
      tutorApproval: 'Tutor approval updates',
      payoutProcessed: 'Payout processed',
      reviews: 'New reviews'
    },
    sms: {
      bookingConfirmations: 'Booking confirmations',
      bookingReminders: 'Booking reminders (1hr before)',
      newMessages: 'New chat messages'
    }
  };

  return (
    <DashboardLayout>
      <DashboardShell className="max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
            <p className="text-slate-500 text-sm">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You\'re all caught up!'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="settings-tabs-scroll sm:flex-wrap bg-slate-100 p-1 rounded-xl mb-6 w-full sm:w-fit">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'inbox' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            Inbox
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{unreadCount}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'preferences' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.39.32.494.856.26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.37.491l-1.216-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Preferences
          </button>
        </div>

        {/* Inbox Tab */}
        {activeTab === 'inbox' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex gap-2 flex-wrap">
                {['All', 'Booking', 'Chat', 'Payment'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      filterType === t ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap">
                  Mark all as read
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-700 mb-1">No notifications</h3>
                <p className="text-xs text-slate-400">You're all caught up. Check back later!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filtered.map((notification) => {
                  const style = typeStyles[notification.type] || typeStyles.System;
                  return (
                    <div
                      key={notification.id}
                      onClick={() => !notification.isRead && handleMarkRead(notification.id)}
                      className={`flex items-start gap-4 p-4 transition-colors cursor-pointer hover:bg-slate-50/50 ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${style.bg} ${style.text} flex items-center justify-center flex-shrink-0`}>
                        {style.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-bold ${!notification.isRead ? 'text-slate-900' : 'text-slate-600'}`}>{notification.title}</h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">{notification.date}</span>
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notification.message}</p>
                        <span className={`inline-flex items-center mt-2 px-2 py-0.5 rounded text-[9px] font-bold ${style.bg} ${style.text} border ${style.border}`}>
                          {notification.type}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && prefs && (
          <div className="space-y-6">
            {/* Email Preferences */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Email Notifications</h3>
                  <p className="text-[10px] text-slate-400">Choose which emails you'd like to receive.</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                {Object.entries(prefLabels.email).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-700 font-medium">{label}</span>
                    <button
                      onClick={() => togglePref('email', key)}
                      className={`w-10 h-6 rounded-full transition-colors relative ${prefs.email[key] ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${prefs.email[key] ? 'left-5' : 'left-1'}`}></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SMS Preferences */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">SMS Notifications</h3>
                  <p className="text-[10px] text-slate-400">Manage SMS alerts for important events.</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                {Object.entries(prefLabels.sms).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-700 font-medium">{label}</span>
                    <button
                      onClick={() => togglePref('sms', key)}
                      className={`w-10 h-6 rounded-full transition-colors relative ${prefs.sms[key] ? 'bg-emerald-600' : 'bg-slate-200'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${prefs.sms[key] ? 'left-5' : 'left-1'}`}></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Quiet Hours</h3>
                    <p className="text-[10px] text-slate-400">Mute all push notifications during set hours.</p>
                  </div>
                </div>
                <button
                  onClick={() => setPrefs(prev => ({ ...prev, quietHours: { ...prev.quietHours, enabled: !prev.quietHours.enabled }}))}
                  className={`w-10 h-6 rounded-full transition-colors relative ${prefs.quietHours.enabled ? 'bg-amber-600' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${prefs.quietHours.enabled ? 'left-5' : 'left-1'}`}></span>
                </button>
              </div>
              {prefs.quietHours.enabled && (
                <div className="p-5 flex items-center gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">From</label>
                    <input
                      type="time"
                      className="h-10 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                      value={prefs.quietHours.start}
                      onChange={(e) => setPrefs(prev => ({ ...prev, quietHours: { ...prev.quietHours, start: e.target.value }}))}
                    />
                  </div>
                  <span className="text-slate-400 font-bold mt-5">→</span>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">To</label>
                    <input
                      type="time"
                      className="h-10 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                      value={prefs.quietHours.end}
                      onChange={(e) => setPrefs(prev => ({ ...prev, quietHours: { ...prev.quietHours, end: e.target.value }}))}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button onClick={handleSavePrefs} disabled={savingPrefs} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-2.5 px-8 rounded-xl text-sm transition-colors shadow-sm">
                {savingPrefs ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        )}
      </DashboardShell>
    </DashboardLayout>
  );
};

export default NotificationsPage;