import RoleSidebar from './RoleSidebar';

/**
 * Standard dashboard chrome: role sidebar + scrollable content with mobile bottom-nav padding.
 */
const DashboardShell = ({ children, className = '', fullWidth = false, hideSidebar = false }) => (
  <div className={hideSidebar ? '' : 'admin-layout'}>
    {!hideSidebar && <RoleSidebar />}
    <div
      className={`screen-area pb-24 md:pb-6 min-w-0 ${fullWidth ? '' : 'max-w-6xl'} ${className}`}
    >
      {children}
    </div>
  </div>
);

export default DashboardShell;
