import { NavLink } from 'react-router-dom';

/**
 * Scrollable bottom navigation for mobile — avoids overlapping when many items exist.
 */
/** Primary links only on mobile (max 5) — rest stay in desktop sidebar. */
const MobileBottomNav = ({ links, endPaths = [], maxItems = 5 }) => {
  const navLinks = links.slice(0, maxItems);
  return (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 safe-area-pb">
    <div className="flex overflow-x-auto scrollbar-hide px-1 py-2 gap-0.5">
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={endPaths.includes(link.to)}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[4.25rem] max-w-[5.5rem] flex-1 px-1 py-1 rounded-lg transition-colors ${
              isActive ? 'text-blue-400 bg-slate-800/80' : 'text-slate-400'
            }`
          }
        >
          <span className="scale-90">{link.icon}</span>
          <span className="text-[8px] font-semibold mt-0.5 truncate w-full text-center leading-tight">
            {link.shortLabel || link.label}
          </span>
        </NavLink>
      ))}
    </div>
  </nav>
  );
};

export default MobileBottomNav;
