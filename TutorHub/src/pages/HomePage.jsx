// HomePage.jsx — Placeholder, full content built on Day 7
// Updated Day 3: now uses PublicLayout so Navbar and Footer appear.

import PublicLayout from '../components/layout/PublicLayout';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// ── Static featured tutors data ─────────────────────────────────────────
const FEATURED_TUTORS = [
  {
    id: 1,
    name: 'Sara Ahmed',
    subject: 'Mathematics & Physics',
    rating: 4.9,
    reviews: 124,
    rate: 'PKR 1,500/hr',
    city: 'Lahore',
    mode: 'Online & In-Person',
    experience: '5 years',
    badge: 'Top Rated',
    initials: 'SA',
    color: 'bg-blue-500',
  },
  {
    id: 2,
    name: 'Ali Hassan',
    subject: 'Chemistry & Biology',
    rating: 4.8,
    reviews: 98,
    rate: 'PKR 1,200/hr',
    city: 'Karachi',
    mode: 'Online Only',
    experience: '3 years',
    badge: 'Verified',
    initials: 'AH',
    color: 'bg-green-500',
  },
  {
    id: 3,
    name: 'Fatima Malik',
    subject: 'English & Urdu',
    rating: 5.0,
    reviews: 67,
    rate: 'PKR 900/hr',
    city: 'Islamabad',
    mode: 'Online Only',
    experience: '4 years',
    badge: 'New',
    initials: 'FM',
    color: 'bg-purple-500',
  },
];

// ── How It Works steps ───────────────────────────────────────────────────
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

// ── Platform stats ───────────────────────────────────────────────────────
const STATS = [
  { value: '2,500+', label: 'Verified Tutors' },
  { value: '10,000+', label: 'Sessions Completed' },
  { value: '15,000+', label: 'Happy Students' },
  { value: '4.9 ★', label: 'Average Rating' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`, {
      state: { query: searchQuery },
    });
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white">
        {/* ═══ HERO SECTION ════════════════════════════════════════════════ */}
        <section className="relative bg-gradient-to-br from-primary to-accent overflow-hidden pt-24 pb-32 px-4">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              2,500+ tutors available right now
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Find the{' '}
              <span className="relative">
                <span className="relative z-10">Perfect Tutor</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-white/20 rounded-full" />
              </span>{' '}
              for Every Subject
            </h1>

            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with verified, expert tutors across Pakistan.
              Learn online or in-person at your place.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
                </svg>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by subject, tutor name, or city..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-neutral-900 text-sm font-medium shadow-lg outline-none focus:ring-4 focus:ring-white/30 transition-all duration-250 placeholder:text-neutral-400"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-4 bg-white text-primary font-bold text-sm rounded-2xl shadow-lg hover:bg-neutral-50 active:scale-[0.98] transition-all duration-250 whitespace-nowrap"
              >
                Search Tutors
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Urdu'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => navigate(`/search?q=${sub}`)}
                  className="px-4 py-1.5 bg-white/10 text-white text-xs font-medium rounded-full hover:bg-white/20 transition-colors duration-250 backdrop-blur-sm"
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ STATS ═════════════════════════════════════════════════════ */}
        <section className="bg-primary py-10 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ HOW IT WORKS ════════════════════════════════════════════════ */}
     <section className="py-24 px-4 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
        <span className="text-accent text-sm font-semibold uppercase trackingwider">
       Simple Process
       </span>
       <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mt-3">
       How TutorHub Works
       </h2>
      <p className="text-neutral-500 mt-4 max-w-xl mx-auto">
       From search to session in under 5 minutes.
      No contracts. Cancel anytime.
       </p>
     </div>
     <div className="grid md:grid-cols-3 gap-8">
      {HOW_IT_WORKS.map((item, idx) => (
      <div key={item.step}
     className="relative bg-white rounded-3xl p-8 shadow-card
      border border-neutral-100 hover:border-primary/20
      hover:shadow-lg transition-all duration-300 group">
       {/* Connector line between cards */}
       {idx < HOW_IT_WORKS.length - 1 && (
       <div className="hidden md:block absolute top-12 -right-4 w-8
        h-px bg-neutral-200 z-10" />
       )}
       {/* Step number */}
 <div className="w-14 h-14 rounded-2xl bg-primary/10
 flex items-center justify-center mb-5
 group-hover:bg-primary group-hover:scale-110
 transition-all duration-300">
 <span className="text-2xl">{item.icon}</span>
 </div>
 <div className="text-xs font-bold text-accent/60 mb-2
 tracking-widest">STEP {item.step}</div>
 <h3 className="text-lg font-bold text-neutral-900 mb-3">
 {item.title}
 </h3>
 <p className="text-neutral-500 text-sm leading-relaxed">
 {item.desc}
 </p>
 </div>
 ))}
 </div>
 </div>
 </section>

        {/* ═══ FEATURED TUTORS ═══════════════════════════════════════════ */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {FEATURED_TUTORS.map((tutor) => (
                <div
                  key={tutor.id}
                  className="bg-white rounded-2xl border border-neutral-200 shadow-card hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="bg-neutral-50 p-6 flex items-start gap-4">
                    <div className={`w-14 h-14 ${tutor.color} rounded-2xl flex items-center justify-center`}>
                      <span className="font-bold text-white text-lg">{tutor.initials}</span>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-neutral-900">{tutor.name}</h3>
                      <p className="text-sm text-neutral-500">{tutor.subject}</p>
                    </div>
                  </div>

                  <div className="p-6 pt-4">
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <span>📍</span>
                        <span>{tutor.city}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">{tutor.rate}</span>
                      <Link to={`/tutor/${tutor.id}`} className="px-4 py-2 bg-primary text-white text-sm rounded-xl">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-primary to-accent py-20 px-4">
 <div className="max-w-3xl mx-auto text-center">
 <h2 className="text-3xl font-bold text-white mb-4">
 Are you a Tutor? Earn on Your Schedule.
 </h2>
 <p className="text-blue-100 text-lg mb-8">
 Join 2,500+ tutors already earning on TutorHub.
 Set your own rates. Teach online or in-person.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link to="/register"
 className="px-8 py-4 bg-white text-primary font-bold rounded-2xl
 hover:bg-neutral-50 active:scale-[0.98]
 transition-all duration-250 shadow-lg">
 Apply as a Tutor
 </Link>
 <Link to="/how-it-works"
 className="px-8 py-4 bg-white/10 text-white font-bold rounded-2xl
 hover:bg-white/20 transition-all duration-250 backdrop-blur-sm">
 Learn More
 </Link>
 </div>
 </div>
 </section>
      </div>

    </PublicLayout>
  );
};

export default HomePage;