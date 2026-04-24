// RegisterPage.jsx — TutorHub account creation page
// Uses: react-hook-form, Zod, authService, Zustand, react-hot-toast
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerSchema } from "../validators/authValidators";
import { register } from "../services/authService";

// ── Role options shown in the toggle ────────────────────────────
const ROLES = [
  { value: "Student", label: "Student"  },
  { value: "Parent", label: "Parent" },
  { value: "Tutor", label: "Tutor" },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("Student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // ^ two separate toggles — confirm field has its own eye button

  const { 
    register: field, 
    handleSubmit, 
    setValue, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "", role: "Student" },
  });
  // Note: 'register' is taken by authService import, so we alias it as 'field'

  // ── Role selection handler ──────────────────────────────────
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setValue("role", role);
    // setValue syncs the Zod-controlled 'role' field with the visual toggle
  };

  // ── Submit ──────────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      await register(data);
      // On success: DO NOT log the user in — they must verify email first
      navigate("/register/success", { state: { email: data.email } });
      // Pass email in router state so success page can display it
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  // ── Input class helper (reduces repetition) ──────────────────
  const inputClass = (hasError) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-colors duration-250 outline-none focus:ring-2 focus:ring-accent focus:border-accent ${
      hasError ? "border-error bg-error-light" : "border-neutral-300 hover:border-neutral-400"
    }`;

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* ── Logo + Heading ───────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl mb-4 shadow-card">
            <span className="text-white font-bold text-2xl select-none">T</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Create your account</h1>
          <p className="text-neutral-500 mt-1 text-sm">Join thousands of learners and tutors on TutorHub</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-neutral-200 p-8">
          {/* ── Role Selector ─────────────────────────── */}
          <div className="mb-6">
            <p className="text-sm font-medium text-neutral-700 mb-3">I am joining as a...</p>
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => handleRoleSelect(r.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all duration-250 ${
                    selectedRole === r.value
                      ? "border-primary bg-primary text-white"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <div className={`font-semibold text-sm ${selectedRole === r.value ? "text-white" : "text-neutral-900"}`}>
                    {r.label}
                  </div>
                 
                </button>
              ))}
            </div>
            {errors.role && (
              <p className="text-error text-xs mt-1.5">⚠ {errors.role.message}</p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* ── First + Last Name (side by side) ─── */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  First name
                </label>
                <input 
                  type="text" 
                  autoComplete="given-name"
                  placeholder="Ahmed" 
                  {...field("firstName")}
                  className={inputClass(!!errors.firstName)} 
                />
                {errors.firstName && (
                  <p className="text-error text-xs mt-1.5">⚠ {errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Last name
                </label>
                <input 
                  type="text" 
                  autoComplete="family-name"
                  placeholder="Khan" 
                  {...field("lastName")}
                  className={inputClass(!!errors.lastName)} 
                />
                {errors.lastName && (
                  <p className="text-error text-xs mt-1.5">⚠ {errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* ── Email ─────────────────────────────── */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Email address
              </label>
              <input 
                type="email" 
                autoComplete="email"
                placeholder="you@example.com" 
                {...field("email")}
                className={inputClass(!!errors.email)} 
              />
              {errors.email && (
                <p className="text-error text-xs mt-1.5">⚠ {errors.email.message}</p>
              )}
            </div>

            {/* ── Password ─────────────────────────── */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password" 
                  placeholder="Min 8 chars, uppercase, number, symbol"
                  {...field("password")} 
                  className={inputClass(!!errors.password) + " pr-12"} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {/* Eye SVG — same as LoginPage */}
                  {showPassword ? "\u{1F441}" : "\u{1F441}\u{FE0F}\u{200D}\u{1F5E8}\u{FE0F}"}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-xs mt-1.5">⚠ {errors.password.message}</p>
              )}
            
            </div>

            {/* ── Confirm Password ─────────────────── */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password" 
                  placeholder="Repeat your password"
                  {...field("confirmPassword")}
                  className={inputClass(!!errors.confirmPassword) + " pr-12"} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  ●
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-error text-xs mt-1.5">⚠ {errors.confirmPassword.message}</p>
              )}
            </div>

            {/* ── Submit ───────────────────────────── */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-250 ${
                isSubmitting
                  ? "bg-neutral-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark active:scale-[0.98] shadow-card"
              }`}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* ── Sign In Link ─────────────────────────── */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400">Already have an account?</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <Link 
            to="/login"
            className="block w-full text-center py-3 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-250"
          >
            Sign in instead
          </Link>
        </div>

        <p className="text-center text-xs text-neutral-400 mt-6">
          By creating an account you agree to our{" "}
          <Link to="/terms" className="underline hover:text-neutral-600">Terms of Use</Link>
          {" "}and{" "}
          <Link to="/privacy" className="underline hover:text-neutral-600">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;