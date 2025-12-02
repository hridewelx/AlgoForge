import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../authenticationSlicer";
import { useTheme } from "../contexts/ThemeContext";
import { Rocket, BarChart2, Trophy, Bot } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3515";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required").trim(),
  password: z.string().min(1, "Password is required"),
});

// Icons
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

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
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

const LoginPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.authentication);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const oauthError = searchParams.get("error");

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  useEffect(() => {
    if (oauthError) {
      const errorMessages = {
        invalid_state: "Security validation failed. Please try again.",
        no_code: "Authorization failed. Please try again.",
        token_error: "Failed to authenticate. Please try again.",
        no_email: "Email access is required. Please grant permission.",
        oauth_error: "Authentication failed. Please try again.",
        oauth_init_error: "Could not connect to provider. Please try again.",
      };
      toast.error(errorMessages[oauthError] || "Authentication failed");
    }
  }, [oauthError]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await dispatch(userLogin(data)).unwrap();
      toast.success("Welcome back!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Login failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setOauthLoading("google");
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    setOauthLoading("github");
    window.location.href = `${API_URL}/auth/github`;
  };

  return (
    <div
      className={`min-h-screen flex ${isDark ? "bg-slate-950" : "bg-slate-50"}`}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
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
            Master algorithms.
            <br />
            <span className="text-emerald-300">Build your future.</span>
          </h1>

          <p className="text-lg text-white/70 mb-10 max-w-md leading-relaxed">
            Join thousands of programmers solving coding challenges, preparing
            for interviews, and sharpening their problem-solving skills.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              {
                icon: <Rocket className="h-5 w-5 text-emerald-300" />,
                text: "500+ curated problems",
              },
              {
                icon: <BarChart2 className="h-5 w-5 text-emerald-300" />,
                text: "Real-time code execution",
              },
              {
                icon: <Trophy className="h-5 w-5 text-emerald-300" />,
                text: "Track your progress",
              },
              {
                icon: <Bot className="h-5 w-5 text-emerald-300" />,
                text: "AI-powered hints",
              },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80">
                <span className="text-xl">{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
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

          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <h2
              className={`text-2xl sm:text-3xl font-bold ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              Welcome back
            </h2>
            <p
              className={`mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Sign in to continue your coding journey
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email/Username Field */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Email or Username
              </label>
              <input
                type="text"
                {...register("identifier")}
                placeholder="you@example.com"
                className={`w-full px-4 py-3.5 rounded-xl transition-all duration-200 outline-none ${
                  isDark
                    ? "bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    : "bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                } ${
                  errors.identifier
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
              />
              {errors.identifier && (
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
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className={`block text-sm font-medium ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className={`text-sm font-medium ${
                    isDark
                      ? "text-emerald-400 hover:text-emerald-300"
                      : "text-emerald-600 hover:text-emerald-700"
                  }`}
                >
                  Forgot password?
                </Link>
              </div>
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
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || oauthLoading !== null}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoading || oauthLoading
                  ? "bg-emerald-500/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
              }`}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className={`absolute inset-0 flex items-center`}>
              <div
                className={`w-full border-t ${
                  isDark ? "border-slate-800" : "border-slate-200"
                }`}
              />
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-4 ${
                  isDark
                    ? "bg-slate-950 text-slate-500"
                    : "bg-slate-50 text-slate-500"
                }`}
              >
                or continue with email
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={oauthLoading !== null}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                isDark
                  ? "bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600"
                  : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm"
              } ${oauthLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {oauthLoading === "google" ? <LoadingSpinner /> : <GoogleIcon />}
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={oauthLoading !== null}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                isDark
                  ? "bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600"
                  : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm"
              } ${oauthLoading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {oauthLoading === "github" ? <LoadingSpinner /> : <GitHubIcon />}
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p
            className={`mt-8 text-center ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className={`font-semibold ${
                isDark
                  ? "text-emerald-400 hover:text-emerald-300"
                  : "text-emerald-600 hover:text-emerald-700"
              }`}
            >
              Create account
            </Link>
          </p>

          {/* Footer */}
          <p
            className={`mt-8 text-center text-xs ${
              isDark ? "text-slate-600" : "text-slate-400"
            }`}
          >
            By continuing, you agree to our{" "}
            <Link to="/terms" className="underline hover:no-underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:no-underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
