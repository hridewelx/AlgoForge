import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Mail, ArrowLeft } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim(),
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

const ForgotPassword = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/user/forgot-password`, {
        email: data.email,
      });

      toast.success(response.data.message || "Reset instructions sent!");
      setEmailSent(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email"
      );
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
            Recover your account.
            <br />
            <span className="text-emerald-300">Get back to coding.</span>
          </h1>

          <p className="text-lg text-white/70 mb-10 max-w-md leading-relaxed">
            Don't worry! It happens to the best of us. We'll send you a link to
            reset your password and get you back on track.
          </p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <Mail className="h-5 w-5 text-emerald-300" />
              <span>Secure password reset via email</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <svg
                className="h-5 w-5 text-emerald-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>One-time secure link expires in 1 hour</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <svg
                className="h-5 w-5 text-emerald-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Your data stays secure and protected</span>
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

          {/* Back to Login Link */}
          <Link
            to="/login"
            className={`inline-flex items-center gap-2 mb-6 text-sm font-medium transition-colors ${
              isDark
                ? "text-slate-400 hover:text-emerald-400"
                : "text-slate-600 hover:text-emerald-600"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          {!emailSent ? (
            <>
              {/* Header */}
              <div className="text-center lg:text-left mb-8">
                <h2
                  className={`text-2xl sm:text-3xl font-bold ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  Forgot your password?
                </h2>
                <p
                  className={`mt-2 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  No worries! Enter your email and we'll send you reset
                  instructions.
                </p>
              </div>

              {/* Reset Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3.5 rounded-xl transition-all duration-200 outline-none ${
                      isDark
                        ? "bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        : "bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    } ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.email.message}
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
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            // Success State
            <div className="text-center">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                  isDark ? "bg-emerald-500/20" : "bg-emerald-100"
                }`}
              >
                <Mail
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
                Check your email
              </h2>
              <p
                className={`mb-6 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                We've sent password reset instructions to your email address.
                The link will expire in 1 hour.
              </p>
              <div
                className={`p-4 rounded-xl mb-6 ${
                  isDark ? "bg-slate-800/50" : "bg-slate-100"
                }`}
              >
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setEmailSent(false)}
                    className={`font-medium ${
                      isDark
                        ? "text-emerald-400 hover:text-emerald-300"
                        : "text-emerald-600 hover:text-emerald-700"
                    }`}
                  >
                    try again
                  </button>
                  .
                </p>
              </div>
              <Link
                to="/login"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  isDark
                    ? "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
