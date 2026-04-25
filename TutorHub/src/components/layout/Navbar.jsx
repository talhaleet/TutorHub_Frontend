// Navbar.jsx — Fully polished navigation for TutorHub
// Handles: logged-out state, student/parent state, tutor state, admin state
import { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { logout } from '../../services/authService';
import { getRefreshToken } from '../../utils/tokenUtils';
import Avatar from '../common/Avatar';
import NotificationBell from '../common/NotificationBell';
import useClickOutside from '../../hooks/useClickOutside';

// Dashboard routes per role — keeps mapping in one place for easy updates
const DASHBOARD_ROUTES = {
  Student: '/dashboard/student',
  Parent:  '/dashboard/parent',
  Tutor:   '/dashboard/tutor',
  Admin:   '/admin',
};

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout: storeLogout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);

  const dropdownRef = useClickOutside(() => setDropdownOpen(false));

  // ── Logout handler ────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken)
        await logout({ refreshToken }); // revoke on server
    } catch {
      // Even if the server call fails, clear local state
    } finally {
      storeLogout();          // clear Zustand + localStorage
      setDropdownOpen(false);
      toast.success('Logged out successfully.');
      navigate('/login');
    }
  };

  // Active NavLink style — highlights current page in nav
  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-250
    ${isActive
      ? 'text-primary border-b-2 border-primary pb-0.5'
      : 'text-neutral-600 hover:text-primary'}`;

  const dashRoute = user ? (DASHBOARD_ROUTES[user.role] || '/') : '/';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200
      shadow-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ──────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center
              justify-center shadow-sm">
              <span className="text-white font-bold text-lg select-none">T</span>
            </div>
            <span className="font-bold text-xl text-neutral-900 select-none">
              TutorHub
            </span>
          </Link>

          {/* ── Desktop Nav Links ─────────────────────── */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/search" className={navLinkClass}>Find Tutors</NavLink>
            <NavLink to="/how-it-works" className={navLinkClass}>
              How It Works
            </NavLink>
            {/* Show 'Become a Tutor' link only for logged-out users */}
            {!isAuthenticated && (
              <NavLink to="/register" className={navLinkClass}>
                Become a Tutor
              </NavLink>
            )}
          </div>

          {/* ── Right Side ──────────────────────────────── */}
          <div className="flex items-center gap-3">

            {isAuthenticated && user ? (
              // ── Logged-in state ─────────────────────────
              <>
                {/* Notification Bell */}
                <NotificationBell />

                {/* User Avatar + Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className="flex items-center gap-2 p-1 rounded-xl
                      hover:bg-neutral-100 transition-colors duration-250"
                    aria-label="User menu"
                    aria-expanded={dropdownOpen}>
                    <Avatar
                      name={`${user.firstName} ${user.lastName}`}
                      size="sm" />
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-neutral-900 leading-tight">
                        {user.firstName}
                      </p>
                      <p className="text-xs text-neutral-500">{user.role}</p>
                    </div>
                    {/* Chevron icon */}
                    <svg className={`w-4 h-4 text-neutral-400 transition-transform
                      duration-250 ${dropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white
                      rounded-2xl shadow-lg border border-neutral-200 py-2
                      z-50 animate-in fade-in slide-in-from-top-2">
                      <Link to={dashRoute}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5
                          text-sm text-neutral-700 hover:bg-neutral-50
                          transition-colors">
                        Dashboard
                      </Link>
                      <Link to="/chat"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5
                          text-sm text-neutral-700 hover:bg-neutral-50
                          transition-colors">
                        Messages
                      </Link>
                      <Link to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5
                          text-sm text-neutral-700 hover:bg-neutral-50
                          transition-colors">
                        Settings
                      </Link>
                      {/* Divider */}
                      <div className="my-1 h-px bg-neutral-100" />
                      <button onClick={handleLogout}
                        className="flex items-center gap-2.5 px-4 py-2.5
                          text-sm text-red-600 hover:bg-red-50
                          transition-colors w-full text-left">
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // ── Logged-out state ─────────────────────────
              // Both Login and Register buttons always visible.
              // This is the final polished state for the auth pages.
              <div className="flex items-center gap-2">
                <Link to="/login"
                  className="hidden sm:inline-flex items-center px-4 py-2
                    rounded-xl text-sm font-medium text-neutral-700
                    hover:text-primary hover:bg-neutral-100
                    transition-all duration-250">
                  Sign In
                </Link>
                <Link to="/register"
                  className="inline-flex items-center px-4 py-2
                    rounded-xl text-sm font-semibold text-white bg-primary
                    hover:bg-primary-dark active:scale-[0.98]
                    shadow-card transition-all duration-250">
                  Get Started
                </Link>
              </div>
            )}

            {/* ── Mobile Hamburger ──────────────────────── */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden p-2 rounded-lg text-neutral-600
                hover:bg-neutral-100 transition-colors"
              aria-label="Open mobile menu">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-3">
          <NavLink to="/search" onClick={() => setMobileOpen(false)}
            className="block py-2.5 text-sm font-medium text-neutral-700
              hover:text-primary">
            Find Tutors
          </NavLink>
          {isAuthenticated ? (
            <>
              <Link to={dashRoute} onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm font-medium text-neutral-700">
                Dashboard
              </Link>
              <button onClick={handleLogout}
                className="block py-2.5 text-sm font-medium text-red-600 w-full text-left">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm font-medium text-neutral-700">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm font-semibold text-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;