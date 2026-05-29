import StaticPage from '../components/layout/StaticPage';

const CookiePolicyPage = () => (
  <StaticPage
    title="Cookie Policy"
    subtitle="How TutorHub uses cookies and similar technologies."
  >
    <h2>What are cookies?</h2>
    <p>
      Cookies are small files stored on your device that help the site remember your session and preferences.
    </p>

    <h2>Cookies we use</h2>
    <ul>
      <li><strong>Essential:</strong> authentication tokens and security (required for login)</li>
      <li><strong>Functional:</strong> remembered filters or UI preferences</li>
      <li><strong>Analytics:</strong> anonymous usage statistics to improve the product (if enabled)</li>
    </ul>

    <h2>Third parties</h2>
    <p>
      Payment providers (e.g. Stripe) may set their own cookies when you complete a checkout. Their policies
      apply to those cookies.
    </p>

    <h2>Managing cookies</h2>
    <p>
      You can clear cookies in your browser settings. Disabling essential cookies may prevent you from
      staying logged in.
    </p>
  </StaticPage>
);

export default CookiePolicyPage;
