// DashboardLayout.jsx — Wrapper for authenticated dashboard pages
// Includes Navbar at top.
// Sidebar will be added here on Day 11 when Sidebar.jsx is built.
// Today, the dashboard pages just render below the Navbar with a container.

import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      {/* Dashboard content area */}
      {/* pt-6: top padding so content does not stick to the Navbar */}
      <div className="container-page py-8">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;