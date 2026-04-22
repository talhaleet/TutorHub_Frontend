// LoginPage.jsx — TutorHub login page with full API integration

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginSchema } from "../validators/authValidators";
import { login } from "../services/authService";
import useAuthStore from "../store/authStore";

// ── Role-to-dashboard map ───────────────────────────
const dashboardRoute = {
  Student: "/dashboard/student",
  Parent: "/dashboard/parent",
  Tutor: "/dashboard/tutor",
  Admin: "/admin",
};

const LoginPage = () => {
  const navigate = useNavigate();
  const authLogin = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);

  // ── react-hook-form setup ─────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // ── Submit handler ────────────────────────────────
  const onSubmit = async (data) => {
    try {
      const response = await login(data);

      // Save user + tokens in Zustand/global state
      authLogin(
        response.user,
        response.accessToken,
        response.refreshToken
      );

      toast.success(`Welcome back, ${response.user.firstName}!`);

      // Redirect based on role
      const route = dashboardRoute[response.user.role] || "/";
      navigate(route, { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Login failed. Please check your credentials.";

      toast.error(message);
    }
  };

  // ── UI ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* ── Logo + Heading ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-card">
            <span className="text-white font-bold text-2xl select-none">T</span>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900">
            Welcome back
          </h1>

          <p className="text-neutral-500 mt-1 text-sm">
            Sign in to your TutorHub account
          </p>
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-2xl shadow-card border border-neutral-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* ── Email ── */}
            <div className="mb-5">
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
                      ? "border-error bg-error-light text-error"
                      : "border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400"
                  }`}
              />

              {errors.email && (
                <p className="text-error text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* ── Password ── */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs text-accent hover:text-primary font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm outline-none transition-colors duration-200
                    focus:ring-2 focus:ring-accent focus:border-accent
                    ${
                      errors.password
                        ? "border-error bg-error-light text-error"
                        : "border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400"
                    }`}
                />

                {/* Toggle password visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {errors.password && (
                <p className="text-error text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition-all
                ${
                  isSubmitting
                    ? "bg-neutral-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark active:scale-[0.98] shadow-card hover:shadow-navbar"
                }`}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400 font-medium">
              New to TutorHub?
            </span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* ── Register ── */}
          <Link
            to="/register"
            className="block w-full text-center py-3 rounded-xl border-2 border-primary text-primary font-semibold text-sm
            hover:bg-primary hover:text-white transition-all active:scale-[0.98]"
          >
            Create your account
          </Link>
        </div>

        {/* ── Footer ── */}
        <p className="text-center text-xs text-neutral-400 mt-6">
          By signing in you agree to our{" "}
          <Link to="/terms" className="underline hover:text-neutral-600">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline hover:text-neutral-600">
            Privacy Policy
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;