import { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { logout } from '../../services/authService';
import { getRefreshToken } from '../../utils/tokenUtils';
import useClickOutside from '../../hooks/useClickOutside';
import useUnreadCounts from '../../hooks/useUnreadCounts';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useClickOutside(() => setDropdownOpen(false));
  const mobileRef = useClickOutside(() => setMobileMenuOpen(false));
  const { chatUnread, notifUnread } = useUnreadCounts();

  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken)
        await logout({ refreshToken });
    } catch {
      // Ignored
    } finally {
      storeLogout();
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      toast.success('Logged out successfully.');
      navigate('/login');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
      isActive
        ? 'text-primary bg-primary/5 font-bold'
        : 'text-slate-600 hover:text-primary hover:bg-slate-50'
    }`;

  const dashRoute = user ? (DASHBOARD_ROUTES[user.role] || '/') : '/';
  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : 'U';

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm" ref={mobileRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/10 transition-transform group-hover:scale-105">
              <svg className="w-5.5 h-5.5 fill-white" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-extrabold text-slate-800 tracking-tight">
              Tutor<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/search" className={navLinkClass}>Find Tutors</NavLink>
            <NavLink to="/how-it-works" className={navLinkClass}>How It Works</NavLink>
            <NavLink to="/pricing" className={navLinkClass}>Pricing</NavLink>
            {isAuthenticated && (user?.role === 'Student' || user?.role === 'Parent') && (
              <NavLink to="/assistant/tutor" className={navLinkClass}>AI Assistant</NavLink>
            )}
            {!isAuthenticated && (
              <NavLink to="/register" className={navLinkClass}>For Tutors</NavLink>
            )}
          </div>

          {/* Desktop Right Hand Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Notifications Icon */}
                <button 
                  onClick={() => navigate('/notifications')}
                  className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors relative"
                >
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notifUnread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center">
                      {notifUnread > 9 ? '9+' : notifUnread}
                    </span>
                  )}
                </button>
                
                {/* Chat Icon */}
                <button 
                  onClick={() => navigate('/chat')}
                  className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors relative"
                >
                  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {chatUnread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center">
                      {chatUnread > 9 ? '9+' : chatUnread}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(o => !o)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-sm hover:opacity-95 transition-opacity"
                  >
                    {userInitials}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                      <Link 
                        to={dashRoute}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/chat"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        Messages
                      </Link>
                      <Link 
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        Settings
                      </Link>
                      <hr className="my-1.5 border-slate-100" />
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-primary transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md shadow-primary/10 transition-colors">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-3">
            {isAuthenticated && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/chat')}
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center relative bg-slate-50"
                  aria-label="Messages"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {chatUnread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-primary rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                      {chatUnread > 9 ? '9+' : chatUnread}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/notifications')}
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center relative bg-slate-50"
                  aria-label="Notifications"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notifUnread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                      {notifUnread > 9 ? '9+' : notifUnread}
                    </span>
                  )}
                </button>
              </>
            )}
            
            <button 
              onClick={() => setMobileMenuOpen(o => !o)}
              className="p-2 rounded-lg text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer/Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white py-4 px-6 flex flex-col gap-2.5 shadow-lg absolute left-0 w-full z-45 animate-fadeIn">
          <Link 
            to="/search" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Find Tutors
          </Link>
          <Link 
            to="/how-it-works" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            How It Works
          </Link>
          <Link 
            to="/pricing" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Pricing
          </Link>
          {isAuthenticated && (user?.role === 'Student' || user?.role === 'Parent') && (
            <Link
              to="/assistant/tutor"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              AI Assistant
            </Link>
          )}
          {!isAuthenticated && (
            <Link 
              to="/register" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              For Tutors
            </Link>
          )}

          <hr className="my-2 border-slate-100" />

          {isAuthenticated ? (
            <>
              <Link 
                to={dashRoute}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Dashboard
              </Link>
              <Link 
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Messages
              </Link>
              <Link 
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Settings
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left block py-2.5 px-4 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-200"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-center text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;