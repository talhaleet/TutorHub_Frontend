import StaticPage from '../components/layout/StaticPage';

const PrivacyPolicyPage = () => (
  <StaticPage
    title="Privacy Policy"
    subtitle="Last updated: May 2026. How TutorHub collects, uses, and protects your information."
  >
    <h2>Information we collect</h2>
    <p>
      We collect information you provide when registering (name, email, role), profile details, booking
      history, payment metadata (processed by our payment provider), and messages sent through the platform.
    </p>

    <h2>How we use your data</h2>
    <ul>
      <li>To operate bookings, messaging, and tutor verification</li>
      <li>To send account and booking notifications</li>
      <li>To improve platform safety and comply with legal obligations</li>
    </ul>

    <h2>Sharing</h2>
    <p>
      We do not sell personal data. We share limited information with tutors/students involved in a booking,
      payment processors, and authorities when required by law.
    </p>

    <h2>Security</h2>
    <p>
      Passwords are hashed. API access uses encrypted connections (HTTPS). Access to admin functions is
      restricted to authorized staff.
    </p>

    <h2>Your rights</h2>
    <p>
      You may request access, correction, or deletion of your account data by contacting{' '}
      <a href="mailto:privacy@tutorhub.pk">privacy@tutorhub.pk</a>.
    </p>

    <h2>Cookies</h2>
    <p>
      See our <a href="/cookies">Cookie Policy</a> for details on session and preference cookies.
    </p>
  </StaticPage>
);

export default PrivacyPolicyPage;
