import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";
import { checkAuthenticatedUser } from "../authenticationSlicer";

const API_URL = import.meta.env.VITE_API_URL;

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(30, "First name is too long"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(30, "Last name is too long")
      .optional()
      .or(z.literal("")),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username is too long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    emailId: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Icons (same as before)
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

const CheckIcon = ({ checked }) => (
  <svg
    className={`w-4 h-4 ${checked ? "text-emerald-500" : "text-slate-400"}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d={checked ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
    />
  </svg>
);

const MailIcon = () => (
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
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const SignupPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State
  const [step, setStep] = useState(1); // 1: Form, 2: Verification
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [resendCountdown, setResendCountdown] = useState(0);

  const { isAuthenticated } = useSelector((state) => state.authentication);
  const codeInputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { terms: false },
  });

  const password = watch("password", "");

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Resend countdown
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { confirmPassword, terms, ...submitData } = data;
      const response = await axios.post(
        `${API_URL}/user/signup/send-code`,
        submitData
      );

      toast.success(response.data.message);
      setUserEmail(response.data.email);
      setStep(2);
      setResendCountdown(60);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs[index + 1].current?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      codeInputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join("");
    if (code.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/user/signup/verify`,
        {
          email: userEmail,
          code,
        },
        { withCredentials: true }
      ); // Important: send cookies

      toast.success(response.data.message);

      // Backend already set the auth cookie, just refresh the auth state
      await dispatch(checkAuthenticatedUser()).unwrap();

      // Navigate to homepage
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
      setVerificationCode(["", "", "", "", "", ""]);
      codeInputRefs[0].current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/user/signup/resend-code`, {
        email: userEmail,
      });
      toast.success(response.data.message);
      setResendCountdown(60);
      setVerificationCode(["", "", "", "", "", ""]);
      codeInputRefs[0].current?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend code");
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

      {/* Left Panel - Form */}
      <div
        className={`w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-8 sm:p-10 lg:p-16 xl:p-20 overflow-y-auto`}
      >
        <div className="w-full max-w-md px-4 sm:px-0 py-8">
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

          {step === 1 ? (
            // STEP 1: Signup Form
            <>
              <div className="text-center lg:text-left mb-8">
                <h2
                  className={`text-2xl sm:text-3xl font-bold ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  Create your account
                </h2>
                <p
                  className={`mt-2 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Start your coding journey today
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("firstName")}
                      placeholder="John"
                      className={`w-full px-3.5 py-3 rounded-xl transition-all duration-200 outline-none text-sm ${
                        isDark
                          ? "bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      } ${errors.firstName ? "border-red-500" : ""}`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1.5 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      {...register("lastName")}
                      placeholder="Doe"
                      className={`w-full px-3.5 py-3 rounded-xl transition-all duration-200 outline-none text-sm ${
                        isDark
                          ? "bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      }`}
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-sm ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      @
                    </span>
                    <input
                      type="text"
                      {...register("username")}
                      placeholder="johndoe"
                      className={`w-full pl-8 pr-3.5 py-3 rounded-xl transition-all duration-200 outline-none text-sm ${
                        isDark
                          ? "bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      } ${errors.username ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("emailId")}
                    placeholder="you@example.com"
                    className={`w-full px-3.5 py-3 rounded-xl transition-all duration-200 outline-none text-sm ${
                      isDark
                        ? "bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        : "bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    } ${errors.emailId ? "border-red-500" : ""}`}
                  />
                  {errors.emailId && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.emailId.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="••••••••"
                      className={`w-full px-3.5 py-3 pr-11 rounded-xl transition-all duration-200 outline-none text-sm ${
                        isDark
                          ? "bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      } ${errors.password ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        isDark
                          ? "text-slate-400 hover:text-slate-300"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                      {[
                        { key: "length", label: "8+ characters" },
                        { key: "uppercase", label: "Uppercase" },
                        { key: "lowercase", label: "Lowercase" },
                        { key: "number", label: "Number" },
                      ].map(({ key, label }) => (
                        <div
                          key={key}
                          className="flex items-center gap-1.5 text-xs"
                        >
                          <CheckIcon checked={passwordChecks[key]} />
                          <span
                            className={
                              passwordChecks[key]
                                ? isDark
                                  ? "text-emerald-400"
                                  : "text-emerald-600"
                                : isDark
                                ? "text-slate-500"
                                : "text-slate-400"
                            }
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-1.5 ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      placeholder="••••••••"
                      className={`w-full px-3.5 py-3 pr-11 rounded-xl transition-all duration-200 outline-none text-sm ${
                        isDark
                          ? "bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      } ${errors.confirmPassword ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        isDark
                          ? "text-slate-400 hover:text-slate-300"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="terms"
                    {...register("terms")}
                    className={`mt-0.5 w-4 h-4 rounded border-2 transition-colors ${
                      isDark
                        ? "border-slate-600 bg-slate-800 checked:bg-emerald-500 checked:border-emerald-500"
                        : "border-slate-300 bg-white checked:bg-emerald-500 checked:border-emerald-500"
                    } focus:ring-2 focus:ring-emerald-500/20`}
                  />
                  <label
                    htmlFor="terms"
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className={`font-medium ${
                        isDark
                          ? "text-emerald-400 hover:text-emerald-300"
                          : "text-emerald-600 hover:text-emerald-700"
                      }`}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className={`font-medium ${
                        isDark
                          ? "text-emerald-400 hover:text-emerald-300"
                          : "text-emerald-600 hover:text-emerald-700"
                      }`}
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-xs text-red-500 -mt-2">
                    {errors.terms.message}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || oauthLoading !== null}
                  className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 mt-6 ${
                    isLoading || oauthLoading
                      ? "bg-emerald-500/50 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      <span>Sending code...</span>
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
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
                    or register with
                  </span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={oauthLoading !== null}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isDark
                      ? "bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600"
                      : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm"
                  } ${oauthLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {oauthLoading === "google" ? (
                    <LoadingSpinner />
                  ) : (
                    <GoogleIcon />
                  )}
                  <span className="hidden sm:inline">Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleGithubLogin}
                  disabled={oauthLoading !== null}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isDark
                      ? "bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600"
                      : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm"
                  } ${oauthLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {oauthLoading === "github" ? (
                    <LoadingSpinner />
                  ) : (
                    <GitHubIcon />
                  )}
                  <span className="hidden sm:inline">GitHub</span>
                </button>
              </div>

              {/* Sign In Link */}
              <p
                className={`mt-6 text-center ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className={`font-semibold ${
                    isDark
                      ? "text-emerald-400 hover:text-emerald-300"
                      : "text-emerald-600 hover:text-emerald-700"
                  }`}
                >
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            // STEP 2: Verification Code
            <div className="text-center">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                  isDark ? "bg-cyan-500/20" : "bg-cyan-100"
                }`}
              >
                <MailIcon
                  className={`${isDark ? "text-cyan-400" : "text-cyan-600"}`}
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
                className={`mb-2 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                We've sent a 6-digit verification code to:
              </p>
              <p
                className={`font-semibold mb-8 ${
                  isDark ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                {userEmail}
              </p>

              {/* Code Input */}
              <div className="flex justify-center gap-2 mb-6">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={codeInputRefs[index]}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl transition-all duration-200 outline-none ${
                      isDark
                        ? "bg-slate-800/50 border-2 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                        : "bg-white border-2 border-slate-200 text-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    }`}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.join("").length !== 6}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 mb-4 ${
                  isLoading || verificationCode.join("").length !== 6
                    ? "bg-cyan-500/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                }`}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    <span>Verifying...</span>
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>

              {/* Resend Code */}
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
                  Didn't receive the code?{" "}
                  {resendCountdown > 0 ? (
                    <span
                      className={isDark ? "text-slate-500" : "text-slate-400"}
                    >
                      Resend in {resendCountdown}s
                    </span>
                  ) : (
                    <button
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className={`font-medium ${
                        isDark
                          ? "text-cyan-400 hover:text-cyan-300"
                          : "text-cyan-600 hover:text-cyan-700"
                      } disabled:opacity-50`}
                    >
                      Resend code
                    </button>
                  )}
                </p>
              </div>

              {/* Back Link */}
              <button
                onClick={() => {
                  setStep(1);
                  setVerificationCode(["", "", "", "", "", ""]);
                }}
                className={`text-sm font-medium ${
                  isDark
                    ? "text-slate-400 hover:text-slate-300"
                    : "text-slate-600 hover:text-slate-700"
                }`}
              >
                ← Back to signup
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Branding (same as before, keeping it concise) */}
      <div
        className={`hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden ${
          isDark
            ? "bg-gradient-to-bl from-cyan-900 via-slate-900 to-slate-950"
            : "bg-gradient-to-bl from-cyan-600 via-emerald-700 to-slate-800"
        }`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-40 right-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-emerald-300 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 2xl:px-32 h-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <CodeIcon />
            </div>
            <span className="text-3xl font-bold text-white">AlgoForge</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            Start solving.
            <br />
            <span className="text-cyan-300">Start growing.</span>
          </h1>
          <p className="text-lg text-white/70 mb-10 max-w-md leading-relaxed">
            Create your free account and join a community of developers who are
            passionate about algorithms and competitive programming.
          </p>
          <div className="grid grid-cols-3 gap-6 mb-10">
            {[
              { value: "50K+", label: "Active Users" },
              { value: "500+", label: "Problems" },
              { value: "10M+", label: "Submissions" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-white/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
