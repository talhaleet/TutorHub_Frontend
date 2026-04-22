// Navbar.jsx — Main navigation component for TutorHub
// Renders differently for logged-out and logged-in users.
// Uses Zustand authStore to read authentication state.

import { useState, useRef, useEffect } from 'react';
// useState: tracks whether the mobile menu and user dropdown are open.
// useRef: references the dropdown DOM element for click-outside detection.
// useEffect: attaches/detaches the click-outside event listener.

import { Link, NavLink, useNavigate } from 'react-router-dom';
// Link: standard navigation links (logo, register button).
// NavLink: like Link but adds an "active" CSS class when the route matches.
//          Used for navigation links so the active page is highlighted.
// useNavigate: programmatic navigation (used after logout).

import useAuthStore from '../../store/authStore';
// Zustand store — provides isAuthenticated, user object, and logout action.

// ── Avatar Helper ────────────────────────────────────────────────────────
// Returns the first letter of the user's first name as a fallback avatar.
// Used when the user has not uploaded a profile photo.
const getInitials = (user) => {
  if (!user) return '?';
  // Prefer firstName if available, otherwise fall back to email first character.
  const name = user.firstName || user.email || 'U';
  return name.charAt(0).toUpperCase();
};

// ── NavLink Active Style Helper ──────────────────────────────────────────
// React Router's NavLink passes { isActive } to the className function.
// We use this to conditionally apply the active color class.
const navLinkClass = ({ isActive }) =>
  isActive
    ? 'text-accent font-semibold border-b-2 border-accent pb-0.5'
    // Active: accent blue underline + bold
    : 'text-neutral-600 hover:text-primary font-medium transition-colors duration-250';
    // Inactive: gray text that turns navy on hover

// ── Role Dashboard Route Helper ──────────────────────────────────────────
// Each user role has a different dashboard URL.
// This function returns the correct path for the "Dashboard" link in thedropdown.
const getDashboardRoute = (role) => {
  const routes = {
    Student: '/dashboard/student',
    Parent:  '/dashboard/parent',
    Tutor:   '/dashboard/tutor',
    Admin:   '/admin',
  };
  // Return the matching route, or '/' as a safe fallback.
  return routes[role] || '/';
};

// ── Main Navbar Component ────────────────────────────────────────────────
const Navbar = () => {
  // ── State ──────────────────────────────────────────────────────────────
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // ^ Controls whether the mobile hamburger menu is expanded.

  const [dropdownOpen, setDropdownOpen] = useState(false);
  // ^ Controls whether the user avatar dropdown is visible.

  // ── Refs ───────────────────────────────────────────────────────────────
  const dropdownRef = useRef(null);
  // ^ Used to detect clicks OUTSIDE the dropdown and close it.

  // ── Auth Store ────────────────────────────────────────────────────────
  const { isAuthenticated, user, logout } = useAuthStore();
  // isAuthenticated: boolean — true if user has a valid JWT.
  // user: object with { firstName, lastName, email, role, ... }
  // logout: Zustand action that clears the token and user from state.

  // ── Navigation ────────────────────────────────────────────────────────
  const navigate = useNavigate();
  // useNavigate gives us a function to redirect programmatically.

  // ── Click Outside Effect ──────────────────────────────────────────────
  // When the dropdown is open, listen for any click on the page.
  // If the click is NOT inside the dropdown element, close the dropdown.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // event.target is what was clicked.
        // If dropdownRef.current does NOT contain the click target,
        // the click was outside — so we close the dropdown.
        setDropdownOpen(false);
      }
    };
    // Add listener only when dropdown is open (performance optimization).
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    // Cleanup: remove listener when dropdown closes or component unmounts.
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);
  // Dependency array [dropdownOpen] means this effect re-runs when dropdownOpen changes.

  // ── Logout Handler ────────────────────────────────────────────────────
  const handleLogout = () => {
    logout();                  // 1. Clear Zustand store (user + token)
    setDropdownOpen(false);    // 2. Close the dropdown
    navigate('/login');        // 3. Redirect to login page
    // Order matters: clear state BEFORE navigating so ProtectedRoute
    // does not briefly flash the protected page during redirect.
  };

  // ── Render ───────────────────────────────────────────────────────────
  return (
    // sticky top-0: navbar stays at the top when user scrolls.
    // z-50: navbar sits above all page content (overlaps modals if z < 50).
    // shadow-navbar: subtle brand-tinted shadow for depth.
    <nav className="sticky top-0 z-50 bg-white shadow-navbar border-b border-neutral-200">
      <div className="container-page">
        {/* ── Desktop Layout: single horizontal flex row ────────────── */}
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ──────────────────────────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            // flex-shrink-0: logo never shrinks on small screens.
          >
            {/* Logo icon: navy square with white "T" letter */}
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg select-none">T</span>
            </div>
            <span className="text-primary font-bold text-xl tracking-tight">
              TutorHub
            </span>
          </Link>

          {/* ── Center Navigation Links (desktop only) ──────────────── */}
          {/* hidden md:flex: hidden on mobile, visible as flex on md+ screens */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/search" className={navLinkClass}>
              Find Tutors
            </NavLink>
            <NavLink to="/#how-it-works" className={navLinkClass}>
              How It Works
            </NavLink>
            <NavLink to="/#for-tutors" className={navLinkClass}>
              For Tutors
            </NavLink>
          </div>

          {/* ── Right Side: Auth Buttons or User Menu ───────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              // ── LOGGED OUT STATE: show Login + Register buttons ────────
              <>
                <Link
                  to="/login"
                  className="text-primary font-medium hover:text-primary-dark transition-colors duration-250"
                >
                  Log In </Link>
                <Link
                  to="/register"
                  // Primary CTA button: filled navy background
                  className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2 rounded-lg transition-colors duration-250"
                >
                  Get Started
                </Link>
              </>
            ) : (
              // ── LOGGED IN STATE: show user avatar + dropdown menu ──────
              <div className="relative" ref={dropdownRef}>
                {/* Avatar button: click to toggle dropdown */}
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  // prev => !prev: toggle pattern — always flips the current value.
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-100 transition-colors duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-expanded={dropdownOpen}
                  // aria-expanded: accessibility attribute — tells screen readers
                  // whether the dropdown is currently open.
                  aria-haspopup="menu"
                >
                  {/* Avatar circle with initials or profile image */}
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={`${user.firstName} avatar`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // Fallback: show first letter of name in white
                      <span className="text-white font-semibold text-sm select-none">
                        {getInitials(user)}
                      </span>
                    )}
                  </div>
                  {/* Show user's first name next to avatar */}
                  <span className="text-neutral-700 font-medium text-sm">
                    {user?.firstName || 'Account'}
                  </span>
                  {/* Chevron icon — rotates 180deg when dropdown is open */}
                  <svg
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-250 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* ── Dropdown Menu ─────────────────────────────────── */}
                {dropdownOpen && (<div
                    role="menu"
                    // role="menu": tells screen readers this is a menu widget.
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-dropdown border border-neutral-200 py-1 z-50"
                    // absolute right-0 top-full: positions dropdown below and right-aligned to the avatar button.
                    // w-56: 224px wide — wide enough for longer role names.
                  >
                    {/* User info header inside dropdown */}
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">
                        {user?.email}
                      </p>
                      {/* Role badge */}
                      <span className="inline-block mt-1.5 text-xs font-medium bg-accent-light text-primary px-2 py-0.5 rounded-full">
                        {user?.role}
                      </span>
                    </div>

                    {/* Navigation items */}
                    <div className="py-1">
                      <Link
                        to={getDashboardRoute(user?.role)}
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        // Close dropdown when a menu item is clicked.
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors duration-250"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/chat"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors duration-250"
                      >
                        Messages
                      </Link>
                      <Link
                        to="/notifications"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors duration-250"
                      >
                        Notifications
                      </Link>
                      <Link
                        to="/settings"role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors duration-250"
                      >
                        Settings
                      </Link>
                    </div>

                    {/* Divider line */}
                    <div className="border-t border-neutral-100 my-1" />

                    {/* Logout button */}
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-light transition-colors duration-250 text-left"
                      // text-error: red color — destructive action warning
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Mobile Hamburger Button (visible on small screens only) ─ */}
          <button
            className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors duration-250"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle mobile menu"
            // aria-label: accessible label for screen readers (no visible text)
          >
            {/* Hamburger / X icon — switches based on menu state */}
            {mobileMenuOpen ? (
              // X icon when menu is open
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Three-line hamburger icon when menu is closed
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* ── Mobile Menu Panel ─────────────────────────────────────────── */}
        {/* Only renders when mobileMenuOpen is true */}
        {mobileMenuOpen && (<div className="md:hidden border-t border-neutral-200 pb-4">
            {/* Navigation links stacked vertically */}
            <div className="flex flex-col pt-3 gap-1">
              <NavLink
                to="/search"
                className="px-4 py-3 text-neutral-700 font-medium hover:bg-neutral-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Tutors
              </NavLink>
              <NavLink
                to="/#how-it-works"
                className="px-4 py-3 text-neutral-700 font-medium hover:bg-neutral-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </NavLink>
              <NavLink
                to="/#for-tutors"
                className="px-4 py-3 text-neutral-700 font-medium hover:bg-neutral-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                For Tutors
              </NavLink>
            </div>

            {/* Auth section in mobile menu */}
            <div className="border-t border-neutral-200 mt-3 pt-3 px-4 flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center border border-primary text-primary font-medium py-2.5 rounded-lg hover:bg-primary hover:text-white transition-colors duration-250"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary-dark transition-colors duration-250"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={getDashboardRoute(user?.role)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center border border-primary text-primary font-medium py-2.5 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center text-error font-medium py-2.5 rounded-lg border border-error hover:bg-error-light transition-colors duration-250"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;