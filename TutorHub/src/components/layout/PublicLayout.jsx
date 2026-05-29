import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = ({ children }) => {
  return (
    <div className="device">
      <Navbar />
      <main style={{ flex: 1, minHeight: 'calc(100vh - 60px)' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;