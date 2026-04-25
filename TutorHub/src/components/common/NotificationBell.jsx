// NotificationBell.jsx — Bell icon with unread count badge
// Stub version: hardcoded to 0 unread.
// Full implementation in Week 4 using useNotifications hook.
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  // TODO Week 4: replace with useNotifications() hook
  const unreadCount = 0;

  return (
    <Link to="/notifications"
      className="relative p-2 rounded-xl text-neutral-600
        hover:bg-neutral-100 hover:text-primary transition-colors duration-250"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}>

      {/* Bell SVG icon */}
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002
          6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159
          c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>

      {/* Unread count badge — only shown if unreadCount > 0 */}
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4
          bg-red-500 text-white text-xs font-bold rounded-full
          flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
