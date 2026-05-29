import PublicLayout from '../components/layout/PublicLayout';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import TutorCard from '../components/tutor/TutorCard'; // I'll use the new TutorCard component for featured tutors
import { searchTutors } from '../services/searchService';

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Search for a Tutor',
    desc: 'Browse hundreds of verified tutors by subject, grade level, city, and price. Use filters to find your perfect match.',
    icon: '🔍',
  },
  {
    step: '02',
    title: 'Book a Session',
    desc: "Select your preferred time slot from the tutor's live calendar. Choose online or in-person. Pay securely in minutes.",
    icon: '📅',
  },
  {
    step: '03',
    title: 'Start Learning',
    desc: 'Join your session with one click. Get personalised teaching. Leave a review to help other students.',
    icon: '🎓',
  },
];

const STATS = [
  { value: '2,500+', label: 'Verified Tutors' },
  { value: '10,000+', label: 'Sessions Completed' },
  { value: '15,000+', label: 'Happy Students' },
  { value: '4.9 ★', label: 'Average Rating' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data: featuredResult,
    isLoading: featuredLoading,
    isError: featuredError,
  } = useQuery({
    queryKey: ['home-featured-tutors'],
    queryFn: () =>
      searchTutors({
        sortBy: 'rating',
        page: 1,
        pageSize: 6,
      }),
    staleTime: 1000 * 60 * 5,
  });
  const featuredTutors = featuredResult?.data ?? [];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`, {
      state: { query: searchQuery },
    });
  };

  return (
    <PublicLayout>
      <div style={{ background: 'var(--gray-50)', minHeight: '100vh' }}>
        
        {/* HERO SECTION */}
        <section style={{ background: 'linear-gradient(135deg, var(--blue-d), var(--blue))', padding: '100px 20px 140px', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
          <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
          
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: '32px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)' }}></div>
              2,500+ tutors available right now
            </div>
            
            <h1 style={{ fontSize: '56px', fontWeight: 900, color: 'white', lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '24px' }}>
              Find the <span style={{ position: 'relative', display: 'inline-block' }}>
                Perfect Tutor
                <div style={{ position: 'absolute', bottom: '6px', left: 0, width: '100%', height: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}></div>
              </span> for Every Subject
            </h1>
            
            <p style={{ fontSize: '18px', color: 'var(--blue-l)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
              Connect with verified, expert tutors across Pakistan. Learn online or in-person at your place.
            </p>
            
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', maxWidth: '600px', margin: '0 auto', background: 'white', padding: '10px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg style={{ position: 'absolute', left: '16px', color: 'var(--gray-400)' }} width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by subject, tutor name, or city..."
                  style={{ width: '100%', padding: '16px 16px 16px 48px', border: 'none', background: 'transparent', fontSize: '15px', outline: 'none', color: 'var(--gray-900)' }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '14px 32px', fontSize: '15px' }}>
                Search Tutors
              </button>
            </form>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '32px' }}>
              {['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => navigate(`/search?q=${sub}`)}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section style={{ background: 'var(--blue)', padding: '40px 20px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
            {STATS.map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>{stat.value}</div>
                <div style={{ fontSize: '14px', color: 'var(--blue-l)', fontWeight: 600, marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: '100px 20px', background: 'white' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Simple Process</div>
              <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--gray-900)', letterSpacing: '-1px', marginBottom: '16px' }}>How TutorHub Works</h2>
              <p style={{ fontSize: '16px', color: 'var(--gray-500)', maxWidth: '500px', margin: '0 auto' }}>From search to session in under 5 minutes. No contracts. Cancel anytime.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="card" style={{ padding: '32px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: '56px', height: '56px', background: 'var(--blue-l)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '24px' }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--blue)', letterSpacing: '1px', marginBottom: '8px' }}>STEP {item.step}</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '12px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--gray-500)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED TUTORS */}
        <section style={{ padding: '100px 20px', background: 'var(--gray-50)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--gray-900)', letterSpacing: '-1px', marginBottom: '16px' }}>Featured Tutors</h2>
              <p style={{ fontSize: '16px', color: 'var(--gray-500)', maxWidth: '500px', margin: '0 auto' }}>Learn from some of our highest rated and most experienced educators.</p>
            </div>
            
            {featuredLoading ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)' }}>
                Loading featured tutors...
              </div>
            ) : featuredError ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)' }}>
                Could not load featured tutors right now.
              </div>
            ) : featuredTutors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)' }}>
                No approved tutors available yet.
              </div>
            ) : (
              <div className="tutor-grid">
                {featuredTutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            )}
            
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link to="/search" className="btn-primary" style={{ padding: '16px 32px', fontSize: '15px' }}>Explore All Tutors →</Link>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section style={{ padding: '100px 20px', background: 'white' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', background: 'linear-gradient(135deg, var(--blue), var(--blue-d))', borderRadius: '32px', padding: '60px 40px', textAlign: 'center', color: 'white', boxShadow: 'var(--shadow-lg)' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-1px' }}>Are you a Tutor? Earn on Your Schedule.</h2>
            <p style={{ fontSize: '18px', color: 'var(--blue-l)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
              Join 2,500+ tutors already earning on TutorHub. Set your own rates. Teach online or in-person.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ background: 'white', color: 'var(--blue)', padding: '16px 32px', fontSize: '15px' }}>Apply as a Tutor</Link>
              <Link to="/how-it-works" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', padding: '16px 32px', fontSize: '15px', background: 'transparent' }}>Learn More</Link>
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
};

export default HomePage;