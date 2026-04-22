// ForgotPasswordPage.jsx — Request a password reset link

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { forgotPasswordSchema } from "../validators/authValidators";
import { forgotPassword } from "../services/authService";

const ForgotPasswordPage = () => {
  // Track success state
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data);
      setEmailSent(true);
    } catch (e) {
      toast.error(`Something went wrong. Please try again. ${e.message}`);
    }
  };

  // ── Success State ─────────────────────────────
  if (emailSent) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">

          <div className="inline-flex items-center justify-center w-20 h-20 bg-success-light rounded-full mb-6 mx-auto">
            <svg
              className="w-10 h-10 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 mb-3">
            Check your inbox
          </h1>

          <p className="text-neutral-500 text-sm mb-2">
            We sent a password reset link to
          </p>

          <p className="font-semibold text-neutral-900 mb-8">
            {getValues("email")}
          </p>

          <p className="text-neutral-400 text-xs mb-8">
            Did not receive it? Check your spam folder or wait a few minutes. The link expires in 1 hour.
          </p>

          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors duration-200"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  // ── Form State ───────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-card">
            <span className="text-white font-bold text-2xl select-none">T</span>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900">
            Forgot your password?
          </h1>

          <p className="text-neutral-500 mt-1 text-sm">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card border border-neutral-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors duration-200
                  focus:ring-2 focus:ring-accent focus:border-accent
                  ${
                    errors.email
                      ? "border-error bg-error-light"
                      : "border-neutral-300 hover:border-neutral-400"
                  }`}
              />

              {errors.email && (
                <p className="text-error text-xs mt-1.5">
                  ⚠ {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200
                ${
                  isSubmitting
                    ? "bg-neutral-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark active:scale-[0.98]"
                }`}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-sm text-accent hover:text-primary font-medium transition-colors duration-200"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;