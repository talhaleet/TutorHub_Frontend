import { Link } from 'react-router-dom';

export default function TutorRecommendationCard({ tutor }) {
  const id = tutor.tutorId;
  const subjects = tutor.subjects || [];
  const mode =
    tutor.teachingMode === 'InPerson'
      ? 'In-person'
      : tutor.teachingMode === 'Both'
        ? 'Online & in-person'
        : tutor.teachingMode === 'Online'
          ? 'Online'
          : tutor.teachingMode || '';

  return (
    <Link
      to={`/tutor/${id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex gap-3">
        <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
          {(tutor.name || 'T')
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900 group-hover:text-blue-700 truncate">{tutor.name}</h3>
          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{tutor.headline}</p>
        </div>
      </div>

      {subjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {subjects.slice(0, 4).map((s) => (
            <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <span>{tutor.city || '—'}</span>
        <span className="text-right">{mode}</span>
        <span>
          ★ {Number(tutor.averageRating || 0).toFixed(1)} ({tutor.totalReviews || 0})
        </span>
        <span className="text-right font-semibold text-slate-800">
          PKR {Number(tutor.hourlyRateMin || 0).toLocaleString()}–{Number(tutor.hourlyRateMax || 0).toLocaleString()}/hr
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {tutor.experienceYears > 0 ? `${tutor.experienceYears}+ years experience` : 'View full profile'}
        </span>
        <span className="text-xs font-bold text-blue-600 group-hover:underline">View profile →</span>
      </div>
    </Link>
  );
}
