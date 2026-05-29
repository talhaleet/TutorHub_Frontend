import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordSchema } from "../validators/authValidators";
import { resetPassword } from "../services/authService";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" }
  });

  if (!token || !email) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Invalid reset link</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            This reset link is missing required information or has expired. Please request a new password reset link.
          </p>
          <Link
            to="/forgot-password"
            className="w-full h-11 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-150 flex items-center justify-center"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      await resetPassword({ email, token, newPassword: data.newPassword });
      setResetDone(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Reset failed. The link may have expired.");
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
          <h2 className="text-2xl font-bold text-slate-800 text-center">Set new password</h2>
          <p className="text-slate-500 text-sm mt-2 text-center break-all">
            Create a secure new password for {email}
          </p>
        </div>

        {resetDone ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Password reset!</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Your password has been updated successfully. You can now sign in with your new password.
            </p>
            <Link
              to="/login"
              className="w-full h-11 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-150 flex items-center justify-center"
            >
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min 8 chars, uppercase, number, symbol"
                  {...register("newPassword")}
                  className={`w-full h-11 pl-4 pr-12 rounded-xl border bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-150 ${
                    errors.newPassword ? "border-red-500" : "border-slate-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold"
                >
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span className="inline-block">⚠</span> {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your new password"
                  {...register("confirmPassword")}
                  className={`w-full h-11 pl-4 pr-12 rounded-xl border bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-150 ${
                    errors.confirmPassword ? "border-red-500" : "border-slate-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span className="inline-block">⚠</span> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
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

export default ResetPasswordPage;