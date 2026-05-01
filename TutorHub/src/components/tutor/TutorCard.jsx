// TutorCard.jsx — src/components/tutor/
import { Link } from "react-router-dom";

const TutorCard = ({ tutor }) => {
  const {
    id, name, headline, subjects, city, teachingMode,
    hourlyRateMin, hourlyRateMax, experienceYears,
    averageRating, totalReviews, isVerified,
    initials, color,
  } = tutor;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-card
                    hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5
                    transition-all duration-300 overflow-hidden group
                    flex flex-col">

      {/* ── Card Header ── */}
      <div className="bg-neutral-50 p-5 flex items-start gap-4 border-b
                      border-neutral-100">

        {/* Avatar */}
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center
                         justify-center flex-shrink-0 group-hover:scale-105
                         transition-transform duration-300`}>
          <span className="font-bold text-white text-lg">{initials}</span>
        </div>

        {/* Name + badge + rating */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="font-bold text-neutral-900 text-base leading-tight">
              {name}
            </h3>
            {/* Verified badge */}
            {isVerified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold
                               bg-primary/10 text-primary px-2 py-0.5 rounded-full
                               flex-shrink-0">
                ✓ Verified
              </span>
            )}
          </div>

          {/* Headline */}
          <p className="text-sm text-neutral-500 mt-0.5 line-clamp-1">
            {headline}
          </p>

          {/* Star rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-sm font-bold text-neutral-800">
              {averageRating.toFixed(1)}
              </span>
            <span className="text-xs text-neutral-400">
              ({totalReviews} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-5 flex-1 flex flex-col">

        {/* Subject tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {subjects.slice(0, 3).map(s => (
            <span key={s}
              className="px-2.5 py-1 bg-primary/5 text-primary text-xs
                         font-semibold rounded-full border border-primary/10"
            >
              {s}
            </span>
          ))}
          {subjects.length > 3 && (
            <span className="px-2.5 py-1 bg-neutral-100 text-neutral-500
                             text-xs rounded-full">
              +{subjects.length - 3}
            </span>
          )}
        </div>

        {/* Meta info rows */}
        <div className="space-y-2 mb-5 flex-1">
          {[
            ["📍", city],
            ["💻", teachingMode === "InPerson" ? "In-Person Only"
                    : teachingMode === "Both" ? "Online & In-Person"
                    : "Online Only"],
            ["⏱", `${experienceYears} year${experienceYears !== 1 ? "s" : ""} experience`],
          ].map(([icon, val]) => (
            <div key={val} className="flex items-center gap-2 text-sm text-neutral-600">
              <span className="text-base">{icon}</span>
              <span>{val}</span>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4
                        border-t border-neutral-100">
          <div>
            <span className="text-lg font-bold text-primary">
              PKR {hourlyRateMin.toLocaleString()}
            </span>
            <span className="text-neutral-400 text-sm"> — </span>
            <span className="text-sm font-semibold text-neutral-600">
              {hourlyRateMax.toLocaleString()}/hr
            </span>
          </div>
          <Link
            to={`/tutor/${id}`}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold
                       rounded-xl hover:bg-primary-dark active:scale-[0.97]
                       transition-all duration-200"
          > View Profile
          </Link>
        </div>

      </div>
    </div>
  );
};

export default TutorCard;