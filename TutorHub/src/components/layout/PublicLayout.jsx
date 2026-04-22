// PublicLayout.jsx — Wrapper for all public-facing pages
// Includes Navbar at top and Footer at bottom.
// Uses flex-col + min-h-screen so Footer always appears at the bottom
// even when page content is short.

import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = ({ children }) => {
  return (
    // min-h-screen: ensures the layout fills the full viewport height.
    // flex flex-col: stacks Navbar, main content, and Footer vertically.
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />
      {/* main tag: semantic HTML — screen readers treat this as the primary content */}
      {/* flex-1: takes all remaining vertical space between Navbar and Footer */}
      <main className="flex-1">
        {children}
        {/* children: whatever page component is passed inside <PublicLayout> */}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;