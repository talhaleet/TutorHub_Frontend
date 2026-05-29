import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/authService";

const STATUS = { LOADING: "loading", SUCCESS: "success", ERROR: "error" };

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(STATUS.LOADING);
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) { setStatus(STATUS.ERROR); return; }
      try {
        await verifyEmail(token);
        setStatus(STATUS.SUCCESS);
      } catch {
        setStatus(STATUS.ERROR);
      }
    };
    verify();
  }, [token]);

  if (status === STATUS.LOADING) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Verifying email</h2>
          <p className="text-slate-500 text-sm">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    );
  }

  if (status === STATUS.ERROR) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Verification failed</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            This verification link is invalid, has expired, or has already been used.
          </p>
          <Link
            to="/register"
            className="w-full h-11 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-150 flex items-center justify-center mb-4"
          >
            Register Again
          </Link>
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Try logging in instead
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Email verified!</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Your account is now active. You're all set to start using TutorHub!
        </p>
        <Link
          to="/login"
          className="w-full h-11 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-150 flex items-center justify-center"
        >
          Sign In Now
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPage;