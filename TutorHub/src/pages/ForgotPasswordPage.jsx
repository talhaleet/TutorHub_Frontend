import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPasswordSchema } from "../validators/authValidators";
import { forgotPassword } from "../services/authService";

const ForgotPasswordPage = () => {
  const [emailSent, setEmailSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm({
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-primary/20">
              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">
              Tutor<span className="text-primary">Hub</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 text-center">Reset your password</h2>
          <p className="text-slate-500 text-sm mt-2 text-center">
            We will send a password reset link to your email address
          </p>
        </div>

        {emailSent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Check your inbox</h3>
            <p className="text-slate-500 text-sm mb-1">We sent a reset link to</p>
            <p className="font-semibold text-slate-800 mb-6 break-all">{getValues("email")}</p>
            <p className="text-xs text-slate-400 mb-8 leading-relaxed">
              Didn't receive it? Please check your spam folder or try requesting another link in a few minutes.
            </p>
            <Link
              to="/login"
              className="w-full h-11 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-150 flex items-center justify-center"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
                className={`w-full h-11 px-4 rounded-xl border bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-150 ${
                  errors.email ? "border-red-500" : "border-slate-200"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span className="inline-block">⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending link..." : "Send Reset Link"}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                ← Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;