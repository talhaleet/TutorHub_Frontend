import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';

function NotFoundPage() {
  return (
    <PublicLayout>
      <div style={{ background: 'linear-gradient(135deg, var(--blue-d), var(--blue))', padding: '80px 20px', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '120px', fontWeight: 900, lineHeight: 1, letterSpacing: '-4px', marginBottom: '16px', opacity: 0.9 }}>404</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>Page Not Found</h1>
          <p style={{ color: 'var(--blue-l)', fontSize: '16px' }}>Oops! The page you're looking for doesn't exist or has been moved.</p>
        </div>
      </div>

      <div style={{ maxWidth: '500px', margin: '-32px auto 80px', padding: '0 16px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '40px 32px' }}>
          <svg width="120" height="120" fill="none" stroke="var(--gray-200)" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 32px', display: 'block' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn-primary" style={{ padding: '12px 24px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Go to Homepage
            </Link>
            <Link to="/search" className="btn-outline" style={{ padding: '12px 24px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Find a Tutor
            </Link>
          </div>

          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--gray-100)' }}>
            <p style={{ color: 'var(--gray-400)', fontSize: '13px' }}>
              Need help? Contact our support at <a href="mailto:support@tutorhub.pk" style={{ color: 'var(--blue)', textDecoration: 'none' }}>support@tutorhub.pk</a>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default NotFoundPage;