import { useLocation, Link } from 'react-router-dom';

const RegisterSuccessPage = () => {
  const location = useLocation();
  const email = location.state?.email || 'your email';

  return (
    <div className="min-h-[calc(100dvh-60px)] flex flex-col lg:flex-row">
      {/* Brand panel — hidden on small screens, visible from lg */}
      <aside className="hidden lg:flex lg:w-[42%] xl:w-[38%] bg-primary text-white p-10 xl:p-14 flex-col justify-center">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-bold text-lg">T</div>
          <span className="font-bold text-xl">TutorHub</span>
        </Link>
        <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight mb-4">Almost there!</h1>
        <p className="text-blue-100 text-base leading-relaxed max-w-md">
          We&apos;ve sent you a verification email. Please check your inbox to activate your account before
          signing in.
        </p>
      </aside>

      {/* Main card — full width on mobile */}
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-white p-4 sm:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10 text-center">
          {/* Mobile-only heading */}
          <div className="lg:hidden mb-6 text-left">
            <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-lg mb-4">
              <span className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-sm">T</span>
              TutorHub
            </Link>
            <h1 className="text-xl font-extrabold text-slate-900">Almost there!</h1>
            <p className="text-slate-500 text-sm mt-1">Check your email to verify your account.</p>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">Check your inbox</h2>
          <p className="text-slate-500 text-sm mb-2">We sent a verification link to</p>
          <p className="font-bold text-slate-900 text-base sm:text-lg break-all mb-4 px-1">{email}</p>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-8">
            Click the link in the email to verify your account. If you don&apos;t see it, check your spam or
            promotions folder.
          </p>

          <Link
            to="/login"
            className="block w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm transition-colors"
          >
            Back to Sign In
          </Link>

          <p className="mt-6 text-xs text-slate-400">
            Need help?{' '}
            <Link to="/help" className="text-primary font-semibold hover:underline">
              Visit Help Center
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterSuccessPage;
