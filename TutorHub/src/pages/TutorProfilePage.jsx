import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTutorProfile } from '../services/tutorService';
import TutorAvailabilityGrid from '../components/tutor/TutorAvailabilityGrid';
import TutorReviewList from '../components/tutor/TutorReviewList';
import PublicLayout from '../components/layout/PublicLayout';
import useAuthStore from '../store/authStore';
import { resolveMediaUrl } from '../services/tutorService';
import { subjectKey, subjectName } from '../utils/subjectUtils';

const TutorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tutor', id],
    queryFn: () => getTutorProfile(id),
    staleTime: 1000 * 60 * 5,
  });

  const tutor = data?.data;

  if (isLoading) return (
    <PublicLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)' }}>
        <div className="skeleton" style={{ width: '200px', height: '200px', borderRadius: '50%' }} />
      </div>
    </PublicLayout>
  );

  if (isError || !tutor) return (
    <PublicLayout>
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Tutor not found</p>
        <Link to="/search" style={{ color: 'var(--blue)', fontWeight: 'bold', textDecoration: 'none' }}>Back to search</Link>
      </div>
    </PublicLayout>
  );

  const initials = (tutor.fullName || '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const canRateTutor = isAuthenticated && (user?.role === 'Student' || user?.role === 'Parent');

  return (
    <PublicLayout>
      <div className="profile-hero" style={{ borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
        <div className="ph-avatar" style={{ background: 'var(--gray-300)' }}>{initials}</div>
        <div className="ph-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div className="ph-name">{tutor.fullName}</div>
            {tutor.isVerified && (
              <span style={{ background: 'rgba(255,255,255,.2)', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                ✓ Verified
              </span>
            )}
          </div>
          <div className="ph-title">{tutor.headline}</div>
          <div className="ph-pills" style={{ marginBottom: '14px' }}>
            {(tutor.subjectNames?.length ? tutor.subjectNames : tutor.subjects)?.map((s, idx) => {
              const label = typeof s === 'string' ? s : subjectName(s);
              if (!label) return null;
              return (
                <span key={subjectKey(s, idx)} className="ph-pill">{label}</span>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'rgba(255,255,255,.75)', flexWrap: 'wrap' }}>
            <span>📍 {tutor.city}</span>
            <span>⏱ {tutor.experienceYears} Years Experience</span>
            <span>👩‍🎓 {tutor.totalReviews} Reviews</span>
          </div>
        </div>
        <div className="ph-right">
          <div className="ph-rating">
            <div className="val">{tutor.averageRating?.toFixed(1) || "N/A"}</div>
            <div className="stars-row">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < Math.round(tutor.averageRating || 0) ? '#F59E0B' : 'rgba(255,255,255,0.3)' }}>★</span>
              ))}
            </div>
            <div className="lbl">{tutor.totalReviews || 0} Reviews</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <button className="btn-primary" style={{ background: 'white', color: 'var(--blue)', justifyContent: 'center' }} onClick={() => navigate(`/book/${tutor.userId}`)}>
              📅 Book Session
            </button>
            <button
              className="btn-outline"
              style={{ borderColor: 'rgba(255,255,255,.4)', color: 'white', justifyContent: 'center', background: 'transparent' }}
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login');
                  return;
                }
                navigate(`/chat?userId=${encodeURIComponent(tutor.userId)}`);
              }}
            >
              💬 Send Message
            </button>
            {canRateTutor && (
              <button
                className="btn-outline"
                style={{ borderColor: 'rgba(255,255,255,.4)', color: 'white', justifyContent: 'center', background: 'transparent' }}
                onClick={() => navigate('/dashboard/bookings')}
              >
                ⭐ Rate Tutor
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="profile-body">
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          {/* About */}
          <div className="card" style={{ marginBottom: '18px' }}>
            <div className="section-head">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              About {tutor.fullName.split(' ')[0]}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '14px' }}>
              {tutor.bio || "No biography provided."}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'var(--gray-50)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--gray-500)', fontWeight: 600, marginBottom: '4px' }}>EXPERIENCE</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)' }}>{tutor.experienceYears} Years</div>
              </div>
              <div style={{ background: 'var(--gray-50)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--gray-500)', fontWeight: 600, marginBottom: '4px' }}>HOURLY RATE</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--blue)' }}>PKR {tutor.hourlyRateMin?.toLocaleString()} - {tutor.hourlyRateMax?.toLocaleString()}</div>
              </div>
            </div>
            <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '10px' }}>
              <div style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 700 }}>TEACHING MODE</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{tutor.teachingMode || 'Online'}</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg,#ecfeff,#cffafe)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#0f766e', fontWeight: 700 }}>CITY</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{tutor.city || 'Pakistan'}</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 700 }}>REVIEWS</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{tutor.totalReviews || 0} feedbacks</div>
              </div>
            </div>
          </div>

          {/* Demo video */}
          <div className="card" style={{ marginBottom: '18px' }}>
            <div className="section-head">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="2"><path d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              Demo Video
            </div>
            {tutor.demoVideoUrl ? (
              <video
                controls
                className="w-full rounded-xl max-h-[360px] bg-black"
                src={resolveMediaUrl(tutor.demoVideoUrl)}
                poster={tutor.profileImageUrl || undefined}
              >
                Your browser does not support video playback.
              </video>
            ) : (
              <div className="video-placeholder">
                <div className="play-btn">
                  <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)', textAlign: 'center' }}>
                  No demo video uploaded yet
                </div>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="card" style={{ marginBottom: '18px' }}>
            <div className="section-head">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              Weekly Availability
            </div>
            <TutorAvailabilityGrid tutorId={tutor.userId} />
          </div>

          {/* Reviews */}
          <div className="card">
            <div className="section-head">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Student Reviews
            </div>
            <TutorReviewList tutorId={tutor.userId} rating={tutor.averageRating} totalReviews={tutor.totalReviews} />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default TutorProfilePage;