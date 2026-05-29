import { useNavigate } from "react-router-dom";
import { subjectKey, subjectName } from "../../utils/subjectUtils";

const TutorCard = ({ tutor }) => {
  const navigate = useNavigate();
  const {
    id, name, headline, subjects, city, teachingMode,
    hourlyRateMin, hourlyRateMax, experienceYears,
    averageRating, totalReviews, isVerified,
    initials, color,
  } = tutor;

  const modeText = teachingMode === "InPerson" ? "In-Person Only"
    : teachingMode === "Both" ? "Online & In-Person"
    : "Online Only";

  return (
    <div className="tutor-card" onClick={() => navigate(`/tutor/${id}`)}>
      <div className="tc-header">
        <div className="tc-avatar-placeholder" style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
          {initials}
        </div>
        <div className="tc-info">
          <div className="tc-name">
            {name}
            {isVerified && (
              <div className="verified">
                <svg viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" stroke="white" fill="none"/></svg>
              </div>
            )}
          </div>
          <div className="tc-title">{headline}</div>
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < Math.round(averageRating) ? "star-fill" : "star-empty"}>★</span>
            ))}
            <span className="rating-text">{averageRating.toFixed(1)}</span>
            <span className="review-count">({totalReviews})</span>
          </div>
        </div>
      </div>
      <div className="tc-body">
        <div className="tc-pills">
          {(subjects || []).slice(0, 3).map((s, idx) => (
            <span key={subjectKey(s, idx)} className="pill">{subjectName(s)}</span>
          ))}
          {subjects.length > 3 && (
            <span className="pill pill-gray">+{subjects.length - 3}</span>
          )}
        </div>
        <div className="tc-meta">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          {city} • {experienceYears} yrs exp
        </div>
        <div className="tc-meta">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <rect stroke="currentColor" x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line stroke="currentColor" x1="16" y1="2" x2="16" y2="6"/>
            <line stroke="currentColor" x1="8" y1="2" x2="8" y2="6"/>
            <line stroke="currentColor" x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {modeText}
        </div>
        <div className="tc-price">
          PKR {hourlyRateMin.toLocaleString()}–{hourlyRateMax.toLocaleString()} <span>/ hour</span>
        </div>
        <div className="tc-actions">
          <button className="btn-primary btn-sm w-full" onClick={(e) => { e.stopPropagation(); navigate(`/tutor/${id}`); }}>View Profile</button>
          <button className="btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/chat`); }}>Message</button>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;