/** Frontend day names (Monday-first UI). */
export const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const CSHARP_DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const TIME_SLOT_LABELS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
];

const dayNameFromApi = (dayOfWeek) => {
  if (typeof dayOfWeek === 'string') {
    const normalized =
      dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1).toLowerCase();
    if (WEEK_DAYS.includes(normalized)) return normalized;
    if (CSHARP_DAY_NAMES.includes(normalized)) return normalized;
  }
  const idx = Number(dayOfWeek);
  if (!Number.isNaN(idx) && idx >= 0 && idx <= 6) {
    return CSHARP_DAY_NAMES[idx];
  }
  return null;
};

const csharpDayFromName = (dayName) => CSHARP_DAY_NAMES.indexOf(dayName);

/** Parse "09:00:00" or "09:00" → minutes from midnight */
const parseTimeSpan = (value) => {
  if (!value) return null;
  const str = String(value);
  const parts = str.split(':').map(Number);
  if (parts.length < 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return null;
  return parts[0] * 60 + parts[1];
};

/** Minutes from midnight → label matching TIME_SLOT_LABELS */
export const minutesToSlotLabel = (minutes) => {
  if (minutes == null) return null;
  let h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m !== 0) return null;
  const period = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  const label = `${String(h).padStart(2, '0')}:00 ${period}`;
  return TIME_SLOT_LABELS.includes(label) ? label : null;
};

const parseSlotLabel = (label) => {
  const match = String(label).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h * 60 + m;
};

const formatTimeSpan = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
};

export const emptySchedule = () => {
  const schedule = {};
  WEEK_DAYS.forEach((d) => {
    schedule[d] = [];
  });
  return schedule;
};

/** API slot list → UI schedule object */
export const apiSlotsToSchedule = (apiSlots) => {
  const schedule = emptySchedule();
  const list = Array.isArray(apiSlots) ? apiSlots : [];

  list.forEach((slot) => {
    if (slot?.isBlocked || slot?.IsBlocked) return;
    const dayName = dayNameFromApi(slot.dayOfWeek ?? slot.DayOfWeek);
    if (!dayName || !schedule[dayName]) return;

    const startMin = parseTimeSpan(slot.startTime ?? slot.StartTime);
    const label = minutesToSlotLabel(startMin);
    if (label && !schedule[dayName].includes(label)) {
      schedule[dayName].push(label);
    }
  });

  WEEK_DAYS.forEach((d) => {
    schedule[d].sort(
      (a, b) => TIME_SLOT_LABELS.indexOf(a) - TIME_SLOT_LABELS.indexOf(b)
    );
  });

  return schedule;
};

/** UI schedule → API DTO array for POST /api/tutor/availability */
export const scheduleToApiSlots = (schedule) => {
  const result = [];

  WEEK_DAYS.forEach((dayName) => {
    const dayIndex = csharpDayFromName(dayName);
    if (dayIndex < 0) return;

    (schedule[dayName] || []).forEach((label) => {
      const startMin = parseSlotLabel(label);
      if (startMin == null) return;
      const endMin = startMin + 60;
      result.push({
        dayOfWeek: dayIndex,
        startTime: formatTimeSpan(startMin),
        endTime: formatTimeSpan(endMin),
        isBlocked: false,
      });
    });
  });

  return result;
};
