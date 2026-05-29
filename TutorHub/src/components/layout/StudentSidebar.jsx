import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import MobileBottomNav from './MobileBottomNav';

const StudentSidebar = () => {
  const { user } = useAuthStore();
  const isParent = user?.role === 'Parent';
  const dashboardRoute = isParent ? '/dashboard/parent' : '/dashboard/student';

  const links = [
    {
      to: dashboardRoute,
      label: 'Overview',
      shortLabel: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
        </svg>
      ),
    },
    {
      to: '/dashboard/bookings',
      label: 'My Bookings',
      shortLabel: 'Bookings',
      icon: (
        <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      ),
    },
  ];

  if (isParent) {
    links.push({
      to: '/dashboard/children',
      label: 'Children Profiles',
      shortLabel: 'Children',
      icon: (
        <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a6 6 0 0 0-10.8 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
        </svg>
      ),
    });
  }

  links.push(
    {
      to: '/dashboard/payments',
      label: 'Payments',
      shortLabel: 'Pay',
      icon: (
        <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
        </svg>
      ),
    },
    {
      to: '/chat',
      label: 'Messages',
      shortLabel: 'Chat',
      icon: (
        <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0H8.25m4.125 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0H12m4.125 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
      ),
    },
    {
      to: '/assistant/tutor',
      label: 'AI Tutor Assistant',
      shortLabel: 'AI',
      icon: (
        <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18l-1.813-2.096A5.987 5.987 0 0 1 6 12V8a6 6 0 1 1 12 0v4a6 6 0 0 1-1.187 3.904L15 18l-.813-2.096M12 8v4m0 0h.01M12 12h-.01" />
        </svg>
      ),
    },
    {
      to: '/notifications',
      label: 'Notifications',
      shortLabel: 'Alerts',
      icon: (
        <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
      ),
    },
    {
      to: '/settings',
      label: 'Settings',
      shortLabel: 'Settings',
      icon: (
        <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827a1.125 1.125 0 0 1 .26 1.43l-1.297 2.247a1.125 1.125 0 0 1-1.37.491l-1.216-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
    }
  );

  const endPaths = [dashboardRoute];

  return (
    <>
      <div className="admin-sidebar hidden md:flex">
        <div className="as-section">User Menu</div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={endPaths.includes(link.to)}
            className={({ isActive }) => `as-item ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
      <MobileBottomNav links={links} endPaths={endPaths} />
    </>
  );
};

export default StudentSidebar;
