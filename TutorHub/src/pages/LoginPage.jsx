import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginSchema } from "../validators/authValidators";
import { login } from "../services/authService";
import useAuthStore from "../store/authStore";

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      authLogin(
        response.user,
        response.accessToken,
        response.refreshToken
      );
      toast.success(`Welcome back, ${response.user.firstName}!`);
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
          <h2 className="text-2xl font-bold text-slate-800 text-center">Welcome back</h2>
          <p className="text-slate-500 text-sm mt-2 text-center">
            Sign in to your account to continue your learning journey
          </p>
        </div>

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

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                {...register("password")}
                className={`w-full h-11 pl-4 pr-12 rounded-xl border bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-150 ${
                  errors.password ? "border-red-500" : "border-slate-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <span className="inline-block">⚠</span> {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
          New to TutorHub?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Create your account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;