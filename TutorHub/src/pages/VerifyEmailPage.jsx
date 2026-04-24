// VerifyEmailPage.jsx — automatic email verification on page load
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/authService";

const STATUS = { LOADING: "loading", SUCCESS: "success", ERROR: "error" };

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(STATUS.LOADING);
  const token = searchParams.get("token");
  // useSearchParams reads ?token=... from the URL without page reload

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus(STATUS.ERROR);
        return;
      }
      try {
        await verifyEmail(token);
        setStatus(STATUS.SUCCESS);
      } catch {
        setStatus(STATUS.ERROR);
      }
    };
    verify();
  }, [token]);
  // [] dependency — runs once on mount. token is stable from searchParams.

  // ── Loading state ────────────────────────────────────────
  if (status === STATUS.LOADING) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-neutral-500 text-sm">Verifying your email...</p>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────
  if (status === STATUS.ERROR) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6 mx-auto">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">
            Verification failed
          </h1>
          <p className="text-neutral-500 text-sm mb-8">
            This verification link is invalid or has already been used.
            Links expire after 24 hours.{" "}
            <Link to="/login" className="text-accent underline">
              Try logging in
            </Link>{" "}
            or register a new account.
          </p>
          <Link 
            to="/register"
            className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors duration-250"
          >
            Register Again
          </Link>
        </div>
      </div>
    );
  }

  // ── Success state ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-success-light rounded-full mb-6 mx-auto">
          <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2}
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">
          Email verified!
        </h1>
        <p className="text-neutral-500 text-sm mb-8">
          Your account is now active. Sign in to start using TutorHub.
        </p>
        <Link 
          to="/login"
          className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors duration-250"
        >
          Sign In Now
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPage;