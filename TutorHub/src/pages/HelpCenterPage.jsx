import { Link } from 'react-router-dom';
import StaticPage from '../components/layout/StaticPage';

const HelpCenterPage = () => (
  <StaticPage
    title="Help Center"
    subtitle="Answers to common questions about finding tutors, booking sessions, and managing your account."
  >
    <h2>Getting started</h2>
    <p>
      Create a free account as a student, parent, or tutor. Parents can add child profiles; tutors complete
      their profile and upload verification documents for admin approval.
    </p>

    <h2>Finding a tutor</h2>
    <p>
      Use <Link to="/search">Find Tutors</Link> to filter by subject, city, price, and rating. Only verified,
      admin-approved tutors appear in search results.
    </p>

    <h2>Bookings &amp; payments</h2>
    <p>
      After choosing a tutor, pick an available slot and pay securely. You will receive booking confirmations
      in your dashboard and by email.
    </p>

    <h2>Messages</h2>
    <p>
      Once logged in, open <strong>Messages</strong> from your dashboard to chat with tutors or students in
      real time.
    </p>

    <h2>Tutor verification</h2>
    <p>
      New tutors must upload ID and qualification documents. An administrator reviews applications under{' '}
      <strong>Admin → Tutor Verifications</strong> before the profile goes live.
    </p>

    <h2>Admin access</h2>
    <p>
      Admin accounts cannot be created from the public registration page. To grant admin access, set{' '}
      <strong>Role = 4 (Admin)</strong> in the database for your user in <code>AspNetUsers</code>, then log out
      and log in again so a new token is issued.
    </p>

    <h2>Still need help?</h2>
    <p>
      <Link to="/contact">Contact our support team</Link> and we will respond within 1–2 business days.
    </p>
  </StaticPage>
);

export default HelpCenterPage;
