// src/pages/TutorAvailabilityPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardShell from '../components/layout/DashboardShell';
import { getAvailability, setAvailability } from '../services/tutorService';
import { emptySchedule, TIME_SLOT_LABELS, WEEK_DAYS } from '../utils/availabilityUtils';
import toast from 'react-hot-toast';

const TutorAvailabilityPage = () => {
  const [schedule, setSchedule] = useState(() => emptySchedule());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const res = await getAvailability();
      const loaded = res?.data;
      // Validate it's an object with day keys, not an array or null
      if (loaded && typeof loaded === 'object' && !Array.isArray(loaded)) {
        setSchedule({ ...emptySchedule(), ...loaded });
      } else {
        setSchedule(emptySchedule());
      }
    } catch (err) {
      console.error('Failed to load availability:', err);
      const msg = err?.response?.data?.message || err?.message || 'Could not load availability';
      toast.error(msg);
      setSchedule(emptySchedule());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const handleToggleSlot = (day, slot) => {
    setSchedule((prev) => {
      const daySlots = prev[day] || [];
      const updated = daySlots.includes(slot)
        ? daySlots.filter((s) => s !== slot)
        : [...daySlots, slot];
      return { ...prev, [day]: updated };
    });
  };

  const handleClearDay = (day) => {
    setSchedule((prev) => ({ ...prev, [day]: [] }));
  };

  const handleCopyMonday = () => {
    const mondaySlots = schedule.Monday || [];
    setSchedule((prev) => {
      const nextSched = { ...prev };
      WEEK_DAYS.slice(1, 5).forEach((day) => {
        nextSched[day] = [...mondaySlots];
      });
      return nextSched;
    });
    toast.success('Monday schedule copied to Tue–Fri');
  };

  const handleSave = async () => {
    const total = WEEK_DAYS.reduce((n, d) => n + (schedule[d]?.length || 0), 0);
    if (total === 0) {
      const ok = window.confirm(
        'No time slots selected. This will remove all availability. Students will not be able to book. Continue?'
      );
      if (!ok) return;
    }

    setSaving(true);
    try {
      await setAvailability(schedule);
      toast.success('Availability saved successfully!');
      await loadSchedule();
    } catch (err) {
      console.error('Failed to save availability:', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to save availability';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardShell>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Availability Settings</h1>
            <p className="text-slate-500 text-sm">
              Configure your recurring weekly schedule. Click Save Schedule — selections are stored in the database.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyMonday}
              className="bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 border border-slate-200 rounded-xl text-xs transition-colors shadow-sm"
            >
              Copy Mon to Tue-Fri
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors shadow-md disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Schedule'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <p className="text-slate-500 text-sm mt-3">Loading schedule...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {WEEK_DAYS.map((day) => {
              const activeSlots = schedule[day] || [];

              return (
                <div
                  key={day}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                      <span className="font-extrabold text-slate-800 text-sm">{day}</span>
                      {activeSlots.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleClearDay(day)}
                          className="text-[10px] font-bold text-rose-500 hover:underline"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {TIME_SLOT_LABELS.map((slot) => {
                        const isSelected = activeSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleToggleSlot(day, slot)}
                            className={`py-2 px-2 text-center rounded-lg font-bold text-[11px] border transition-all ${
                              isSelected
                                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                                : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 text-[10px] font-semibold text-slate-400 text-center">
                    {activeSlots.length} slot{activeSlots.length !== 1 ? 's' : ''} active
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DashboardShell>
    </DashboardLayout>
  );
};

export default TutorAvailabilityPage;
