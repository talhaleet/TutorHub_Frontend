import { Link } from 'react-router-dom';
import StaticPage from '../components/layout/StaticPage';

const TermsOfUsePage = () => (
  <StaticPage
    title="Terms of Use"
    subtitle="By using TutorHub you agree to these terms. Please read them carefully."
  >
    <h2>Platform role</h2>
    <p>
      TutorHub connects students and parents with independent tutors. We are not the employer of tutors and
      do not guarantee academic outcomes.
    </p>

    <h2>Accounts</h2>
    <p>
      You must provide accurate information, keep credentials secure, and use one account per person. Tutors
      must pass document verification before appearing in search.
    </p>

    <h2>Bookings &amp; cancellations</h2>
    <p>
      Session times, fees, and cancellation rules are shown at booking. Refunds follow the policy displayed
      at checkout and applicable payment provider rules.
    </p>

    <h2>Conduct</h2>
    <p>
      Harassment, fraud, sharing inappropriate content, or circumventing payments through the platform is
      prohibited and may result in account suspension.
    </p>

    <h2>Payments</h2>
    <p>
      Tutors receive payouts minus applicable platform fees. Students/parents authorize charges for confirmed
      bookings.
    </p>

    <h2>Limitation of liability</h2>
    <p>
      TutorHub is provided &quot;as is.&quot; We are not liable for indirect damages arising from use of the
      service, to the extent permitted by law.
    </p>

    <h2>Contact</h2>
    <p>
      Questions about these terms: <Link to="/contact">Contact Us</Link>.
    </p>
  </StaticPage>
);

export default TermsOfUsePage;
