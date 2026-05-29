import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="device">
      <Navbar />
      <div className="page-body">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;