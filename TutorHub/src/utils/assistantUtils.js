/** Normalize tutor recommendation from API (camelCase or PascalCase). */
export const normalizeTutorRecommendation = (t) => {
  if (!t) return null;
  const tutorId = t.tutorId ?? t.TutorId;
  if (!tutorId) return null;
  return {
    tutorId: String(tutorId),
    name: t.name ?? t.Name ?? 'Tutor',
    headline: t.headline ?? t.Headline ?? '',
    city: t.city ?? t.City ?? '',
    teachingMode: t.teachingMode ?? t.TeachingMode ?? '',
    hourlyRateMin: t.hourlyRateMin ?? t.HourlyRateMin ?? 0,
    hourlyRateMax: t.hourlyRateMax ?? t.HourlyRateMax ?? 0,
    averageRating: t.averageRating ?? t.AverageRating ?? 0,
    totalReviews: t.totalReviews ?? t.TotalReviews ?? 0,
    experienceYears: t.experienceYears ?? t.ExperienceYears ?? 0,
    subjects: t.subjects ?? t.Subjects ?? [],
    profileUrl: t.profileUrl ?? t.ProfileUrl ?? `/tutor/${tutorId}`,
  };
};

/** True if text is a JSON array of tutor objects. */
export const isTutorJsonArray = (text) => {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (!trimmed.startsWith('[')) return false;
  try {
    const parsed = JSON.parse(trimmed);
    return (
      Array.isArray(parsed) &&
      parsed.length > 0 &&
      parsed.some((x) => x && (x.TutorId || x.tutorId))
    );
  } catch {
    return false;
  }
};

/** Parse tutor JSON array string into card objects. */
export const parseTutorJsonArray = (text) => {
  if (!isTutorJsonArray(text)) return [];
  try {
    const parsed = JSON.parse(text.trim());
    return parsed.map(normalizeTutorRecommendation).filter(Boolean);
  } catch {
    return [];
  }
};

export const mergeRecommendations = (...lists) => {
  const seen = new Set();
  const out = [];
  for (const list of lists) {
    for (const t of list || []) {
      const n = normalizeTutorRecommendation(t);
      if (!n || seen.has(n.tutorId)) continue;
      seen.add(n.tutorId);
      out.push(n);
    }
  }
  return out;
};

const TUTOR_SEARCH_FALLBACK =
  'Here are tutors that match your request. Tap a card to open their profile and book a session.';

/** Normalize full assistant API response for the UI. */
export const normalizeAssistantResponse = (data) => {
  const intent = (data?.intent ?? data?.Intent ?? 'general_qa').toLowerCase();
  let reply = (data?.reply ?? data?.Reply ?? '').trim();

  const fromApi = (data?.recommendations ?? data?.Recommendations ?? [])
    .map(normalizeTutorRecommendation)
    .filter(Boolean);

  let recommendations = mergeRecommendations(fromApi);

  // Entire reply is raw tutor JSON (common Gemini mistake) → convert to cards
  if (isTutorJsonArray(reply)) {
    const parsed = parseTutorJsonArray(reply);
    if (intent === 'tutor_search') {
      recommendations = mergeRecommendations(parsed, recommendations);
      reply = TUTOR_SEARCH_FALLBACK;
    } else {
      recommendations = [];
      reply = '';
    }
  }

  // General questions must never show tutor cards
  if (intent === 'general_qa' || intent === 'platform_help') {
    recommendations = [];
  }

  if (!reply && recommendations.length > 0) {
    reply = TUTOR_SEARCH_FALLBACK;
  }

  if (!reply) {
    reply =
      intent === 'tutor_search'
        ? 'I searched our tutor list. Try rephrasing with subject, city, and budget.'
        : 'I could not generate a reply. Please try again.';
  }

  return {
    reply,
    recommendations,
    intent,
    mode: (data?.mode ?? data?.Mode ?? 'offline').toLowerCase(),
    historyText: reply,
  };
};
