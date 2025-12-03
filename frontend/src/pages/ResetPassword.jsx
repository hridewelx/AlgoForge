import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const CodeIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>
);

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);

const ResetPassword = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      toast.error("Invalid reset link");
      setTimeout(() => navigate("/forgot-password"), 2000);
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/user/reset-password`, {
        token: token,
        password: data.password,
      });

      toast.success(response.data.message || "Password reset successful!");
      setResetSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex ${isDark ? "bg-slate-950" : "bg-slate-50"}`}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? "#1e293b" : "#ffffff",
            color: isDark ? "#f1f5f9" : "#1e293b",
            border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "16px",
          },
        }}
      />

      {/* Left Panel - Branding */}
      <div
        className={`hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950"
            : "bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-800"
        }`}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-emerald-300 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-300 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 2xl:px-32 h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <CodeIcon />
            </div>
            <span className="text-3xl font-bold text-white">AlgoForge</span>
          </div>

          {/* Main Content */}
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            Create a new password.
            <br />
            <span className="text-emerald-300">Secure your account.</span>
          </h1>

          <p className="text-lg text-white/70 mb-10 max-w-md leading-relaxed">
            Choose a strong password to keep your account safe. Make it
            memorable but hard to guess!
          </p>

          {/* Password Tips */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <svg
                className="h-5 w-5 text-emerald-300 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>At least 8 characters long</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <svg
                className="h-5 w-5 text-emerald-300 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Mix of uppercase and lowercase letters</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <svg
                className="h-5 w-5 text-emerald-300 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Include numbers and special characters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Reset Form */}
      <div
        className={`w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-8 sm:p-10 lg:p-16 xl:p-20`}
      >
        <div className="w-full max-w-md px-4 sm:px-0">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div
              className={`p-2.5 rounded-xl ${
                isDark
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-emerald-100 text-emerald-600"
              }`}
            >
              <CodeIcon />
            </div>
            <span
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              AlgoForge
            </span>
          </div>

          {!resetSuccess ? (
            <>
              {/* Header */}
              <div className="text-center lg:text-left mb-8">
                <h2
                  className={`text-2xl sm:text-3xl font-bold ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  Reset your password
                </h2>
                <p
                  className={`mt-2 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Enter a new password for your account
                </p>
              </div>

              {/* Reset Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Password Field */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3.5 pr-12 rounded-xl transition-all duration-200 outline-none ${
                        isDark
                          ? "bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      } ${
                        errors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                        isDark
                          ? "text-slate-400 hover:text-slate-300"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3.5 pr-12 rounded-xl transition-all duration-200 outline-none ${
                        isDark
                          ? "bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      } ${
                        errors.confirmPassword
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                        isDark
                          ? "text-slate-400 hover:text-slate-300"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                    isLoading
                      ? "bg-emerald-500/50 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                    isDark
                      ? "text-slate-400 hover:text-emerald-400"
                      : "text-slate-600 hover:text-emerald-600"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            </>
          ) : (
            // Success State
            <div className="text-center">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                  isDark ? "bg-emerald-500/20" : "bg-emerald-100"
                }`}
              >
                <CheckCircle
                  className={`w-8 h-8 ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
              </div>
              <h2
                className={`text-2xl font-bold mb-3 ${
                  isDark ? "text-white" : "text-slate-800"
                }`}
              >
                Password reset successful!
              </h2>
              <p
                className={`mb-6 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Your password has been updated. Redirecting you to login...
              </p>
              <div
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl ${
                  isDark ? "bg-slate-800/50" : "bg-slate-100"
                }`}
              >
                <LoadingSpinner />
                <span
                  className={`${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  Redirecting...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
