// ResetPasswordPage.jsx — Set a new password using the token from the reset email
// Route: /reset-password?token=...&email=...
// This page is reached ONLY from the email link sent by ForgotPasswordPage.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordSchema } from "../validators/authValidators";
import { resetPassword } from "../services/authService";

const ResetPasswordPage = () => {
 
  const [searchParams] = useSearchParams();

  // Extract ?token= and ?email= from the URL.
  // These were URL-encoded by Haseeb's ForgotPasswordAsync.
  // useSearchParams automatically URL-decodes them.
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" }
  });

  // Guard: if token or email is missing from the URL,
  // show an error immediately — do not render the form.
  if (!token || !email) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6 mx-auto">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">
            Invalid reset link
          </h1>
          <p className="text-neutral-500 text-sm mb-8">
            This reset link is missing required information.
            Please request a new password reset link.
          </p>
          <Link to="/forgot-password"
            className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      await resetPassword({
        email,          // email from URL query param
        token,          // token from URL query param (auto-decoded by useSearchParams)
        newPassword: data.newPassword
      });
      setResetDone(true);
      // Do not auto-navigate — show success state, let user click Sign In.
    } catch (error) {
      const message = error?.response?.data?.message ||
        "Reset failed. The link may have expired. Please request a new one.";
      toast.error(message);
    }
  };

  // ── Success State ───────────────────────────────────────────────
  if (resetDone) return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-success-light rounded-full mb-6 mx-auto">
          <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">
          Password reset!
        </h1>
        <p className="text-neutral-500 text-sm mb-8">
          Your password has been updated successfully.
          You can now sign in with your new password.
        </p>
        <Link to="/login"
          className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
          Sign In Now
        </Link>
      </div>
    </div>
  );

  // ── Form State ──────────────────────────────────────────────────
  // Helper for consistent input class (same pattern as Day 4 LoginPage)
  const inputClass = (hasError) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-colors duration-250
    outline-none focus:ring-2 focus:ring-accent focus:border-accent
    ${hasError
      ? 'border-error bg-error-light text-error'
      : 'border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400'}`

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* ── Header ──────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-card">
            <span className="text-white font-bold text-2xl select-none">T</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Set new password
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Creating a new password for{" "}
            <span className="font-semibold text-neutral-700">{email}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-neutral-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* ── New Password ──────────────────────── */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min 8 chars, uppercase, number, symbol"
                  {...register('newPassword')}
                  className={inputClass(!!errors.newPassword) + ' pr-12'}
                />
                <button type="button"
                  onClick={() => setShowNew(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label={showNew ? 'Hide password' : 'Show password'}>
                  {/* Use same SVG eye icons as LoginPage for consistency */}
                  {showNew ? '\u{1F441}' : '●'}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-error text-xs mt-1.5">
                  ⚠ {errors.newPassword.message}
                </p>
              )}
              {/* Password requirements hint */}
              <ul className="mt-2 space-y-0.5">
                {['At least 8 characters', 'One uppercase letter',
                  'One number', 'One special character'].map(hint => (
                  <li key={hint}
                    className="text-xs text-neutral-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-neutral-300" />{hint}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Confirm Password ──────────────────── */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat your new password"
                  {...register('confirmPassword')}
                  className={inputClass(!!errors.confirmPassword) + ' pr-12'}
                />
                <button type="button"
                  onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
                  ●
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-error text-xs mt-1.5">
                  ⚠ {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* ── Submit ────────────────────────────── */}
            <button type="submit" disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-250
                ${isSubmitting
                  ? 'bg-neutral-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark active:scale-[0.98] shadow-card'}`}>
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/login"
              className="text-sm text-accent hover:text-primary font-medium transition-colors duration-250">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;