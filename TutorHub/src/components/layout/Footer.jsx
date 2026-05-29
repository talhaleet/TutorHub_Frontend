// Footer.jsx — Site-wide footer for TutorHub
// Displays on all public-facing pages (not inside dashboards).
// Uses a dark navy background matching the primary brand color.

import { Link } from 'react-router-dom';
// Link: React Router navigation — prevents full page reloads for internal links.

// ── Footer Link Columns Definition ──────────────────────────────────────
// Defined outside the component so it is not recreated on every render.
// Each column has a title and an array of { label, path } links.
const footerColumns = [
  {
    title: 'Platform',
    links: [
      { label: 'Find Tutors',   path: '/search' },
      { label: 'How It Works',  path: '/how-it-works' },
      { label: 'For Tutors',    path: '/for-tutors' },
      { label: 'Pricing',       path: '/pricing' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Log In',        path: '/login' },
      { label: 'Register',      path: '/register' },
      { label: 'Dashboard',     path: '/dashboard/student' },
      { label: 'Settings',      path: '/settings' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center',   path: '/help' },
      { label: 'Contact Us',    path: '/contact' },
      { label: 'Privacy Policy',path: '/privacy' },
      { label: 'Terms of Use',  path: '/terms' },
    ],
  },
];

const Footer = () => {
  // Get the current year dynamically so copyright stays accurate.
  const currentYear = new Date().getFullYear();

  return (
    // bg-primary: navy background — consistent with navbar for brand cohesion.
    // mt-auto: pushes footer to bottom when page content is short (needs flex parent).
    <footer className="bg-primary text-white mt-auto">
      <div className="container-page py-14">

        {/* ── Top Section: Logo + Link Columns ──────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand Column ──────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            {/* Logo — same design as Navbar for consistency */}
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                {/* accent-colored logo in footer to contrast with navy background */}
                <span className="text-white font-bold text-lg select-none">T</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                TutorHub
              </span>
            </Link>
            {/* Brand tagline */}
            <p className="text-neutral-300 text-sm leading-relaxed max-w-xs">
              Connecting students with qualified tutors across Pakistan.
              Learn at your own pace, on your own schedule.
            </p>
          </div>

          {/* ── Link Columns: generated from footerColumns array ─────── */}
          {footerColumns.map((column) => (
            // key must be unique — using column title as it is stable and descriptive.
            <div key={column.title}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {/* uppercase + tracking-wider: common pattern for footer column headers */}
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      // text-neutral-300: slightly muted so header titles stand out.
                      // hover:text-accent: reveals brand color on hover — subtle interaction.
                      className="text-neutral-300 text-sm hover:text-accent transition-colors duration-250"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="border-t border-neutral-600 mt-12 pt-8">
          {/* border-neutral-600: slightly lighter than bg-primary so it is visible */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Copyright notice — year updates automatically */}
            <p className="text-neutral-400 text-sm">
              {currentYear} TutorHub. All rights reserved.
            </p>

            {/* Legal links — inline list with dot separators */}
            <div className="flex items-center gap-6">
              {[
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Terms of Use',  path: '/terms' },
                { label: 'Cookie Policy', path: '/cookies' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-neutral-400 text-xs hover:text-accent transition-colors duration-250"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;