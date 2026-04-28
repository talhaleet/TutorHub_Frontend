// TutorCard.jsx — src/components/tutor/
// Displays a single tutor in search results.

import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';

const TutorCard = ({ tutor }) => {
  const {
    userId,
    firstName,
    lastName,
    headline,
    city,
    hourlyRateMin,
    teachingMode,
    averageRating,
    totalReviews,
    isVerified,
    experienceYears,
    subjects = [],
    profileImageUrl,
  } = tutor;

  const modeLabel = {
    Online: 'Online Only',
    InPerson: 'In-Person',
    Both: 'Online & In-Person',
  }[teachingMode] || teachingMode;

  const modeColor = {
    Online: 'bg-blue-50 text-blue-700',
    InPerson: 'bg-purple-50 text-purple-700',
    Both: 'bg-green-50 text-green-700',
  }[teachingMode] || 'bg-neutral-100 text-neutral-600';

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-card
    hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5
    transition-all duration-300 overflow-hidden group">

      {/* ── Header ───────────────── */}
      <div className="p-5 flex items-start gap-4">
        <Avatar
          name={`${firstName} ${lastName}`}
          imageUrl={profileImageUrl}
          size="lg"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-neutral-900 text-base truncate">
                  {firstName} {lastName}
                </h3>

                {isVerified && (
                  <span
                    title="Verified Tutor"
                    className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-500 mt-0.5 truncate">
                {headline}
              </p>
            </div>

            {/* Rate */}
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-primary text-sm">
                PKR {(hourlyRateMin || 0).toLocaleString()}
              </p>
              <p className="text-xs text-neutral-400">per hour</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i <= Math.round(averageRating || 0)
                      ? 'text-yellow-400'
                      : 'text-neutral-200'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <span className="text-sm font-semibold text-neutral-800">
              {averageRating > 0 ? averageRating.toFixed(1) : 'New'}
            </span>

            {totalReviews > 0 && (
              <span className="text-xs text-neutral-400">
                ({totalReviews} reviews)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Subjects ───────────────── */}
      {subjects.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {subjects.slice(0, 4).map((s) => (
            <span
              key={s.id}
              className="px-2.5 py-1 bg-primary/8 text-primary text-xs font-medium rounded-full"
            >
              {s.name}
            </span>
          ))}

          {subjects.length > 4 && (
            <span className="px-2.5 py-1 bg-neutral-100 text-neutral-500 text-xs font-medium rounded-full">
              +{subjects.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* ── Meta ───────────────── */}
      <div className="px-5 pb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="text-xs text-neutral-500 flex items-center gap-1">
          📍 {city}
        </span>

        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${modeColor}`}
        >
          {modeLabel}
        </span>

        {experienceYears > 0 && (
          <span className="text-xs text-neutral-500 flex items-center gap-1">
            ⏱ {experienceYears} yr{experienceYears > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Actions ───────────────── */}
      <div className="px-5 pb-5 flex items-center gap-2 border-t border-neutral-100 pt-4">
        <Link
          to={`/tutor/${userId}`}
          className="flex-1 py-2.5 bg-primary text-white text-sm font-semibold
          rounded-xl text-center hover:bg-primary-dark active:scale-[0.98]
          transition-all duration-250 shadow-card"
        >
          View Profile
        </Link>

        <Link
          to={`/book/${userId}`}
          className="px-4 py-2.5 border-2 border-primary text-primary text-sm
          font-semibold rounded-xl hover:bg-primary/5 active:scale-[0.98]
          transition-all duration-250"
        >
          Book
        </Link>
      </div>
    </div>
  );
};

export default TutorCard;