import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, ShieldCheck, KeyRound } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Services and Hooks
import { authService } from "../services/auth";
import useOtpTimer from "../hooks/useOtpTimer";
import usePasswordStrength from "../hooks/usePasswordStrength";
import useFormValidation from "../hooks/useFormValidation";

// Reusable Auth Components
import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import AuthHeader from "../components/auth/AuthHeader";
import StepIndicator from "../components/auth/StepIndicator";
import InputField from "../components/auth/InputField";
import PasswordInput from "../components/auth/PasswordInput";
import OTPInput from "../components/auth/OTPInput";
import LoadingButton from "../components/auth/LoadingButton";
import CountdownTimer from "../components/auth/CountdownTimer";
import SuccessScreen from "../components/auth/SuccessScreen";

function SignupPage() {
  const navigate = useNavigate();

  // Progress steps: 1 (Email), 2 (OTP), 3 (Credentials)
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Uniqueness check states
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null); // null, true (available), false (taken)
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Custom hooks
  const { seconds: timerSeconds, start: startTimer, reset: resetTimer, isFinished: isTimerFinished } = useOtpTimer(30);
  const passwordStrength = usePasswordStrength(password);

  // Validation rules configuration
  const validationRules = {
    email: {
      required: true,
      requiredMessage: "Email address is required",
      pattern: /^\S+@\S+\.\S+$/,
      patternMessage: "Please enter a valid email address"
    },
    otp: {
      required: true,
      requiredMessage: "Verification code is required",
      pattern: /^\d{6}$/,
      patternMessage: "Verification code must consist of exactly 6 digits"
    },
    username: {
      required: true,
      requiredMessage: "Username is required",
      minLength: 4,
      minLengthMessage: "Username must be at least 4 characters",
      custom: (val) => {
        // Alphanumeric and underscores only, max 15 chars
        return /^[a-zA-Z0-9_]{4,15}$/.test(val);
      },
      customMessage: "Username must be 4-15 characters and contain only letters, numbers, or underscores"
    },
    password: {
      required: true,
      requiredMessage: "Password is required",
      custom: () => {
        // Must qualify as "Strong" (score === 3)
        return passwordStrength.score === 3;
      },
      customMessage: "Password must contain at least 8 characters, uppercase, lowercase, numbers, and symbols"
    },
    confirmPassword: {
      required: true,
      requiredMessage: "Please confirm your password",
      custom: (val) => val === password,
      customMessage: "Passwords do not match"
    }
  };

  const { errors, validate, clearErrors, setFieldError } = useFormValidation(validationRules);

  // Async username uniqueness checker on blur
  const handleUsernameBlur = async () => {
    const cleanUsername = username.trim();
    if (cleanUsername.length < 4 || !/^[a-zA-Z0-9_]{4,15}$/.test(cleanUsername)) {
      setUsernameAvailable(null);
      return;
    }

    try {
      setUsernameChecking(true);
      const res = await authService.checkUsernameAvailability(cleanUsername);
      setUsernameAvailable(res.available);
      if (!res.available) {
        setFieldError("username", "This username is already taken");
      }
    } catch {
      setUsernameAvailable(null);
    } finally {
      setUsernameChecking(false);
    }
  };

  // Reset check when username value changes
  useEffect(() => {
    setUsernameAvailable(null);
  }, [username]);

  // Resend OTP handler
  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      await authService.sendOtp(email);
      resetTimer();
      toast.success("Verification code resent successfully!", { icon: "📨" });
    } catch (err) {
      toast.error(err.message || "Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step-by-Step Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      const isValid = validate({ email });
      if (!isValid) return;

      try {
        setIsLoading(true);
        await authService.sendOtp(email);
        toast.success("Verification code sent!", { icon: "📨" });
        setStep(2);
        startTimer();
      } catch (err) {
        toast.error(err.message || "Failed to send code.");
      } finally {
        setIsLoading(false);
      }
    } else if (step === 2) {
      const isValid = validate({ otp });
      if (!isValid) return;

      try {
        setIsLoading(true);
        await authService.verifyOtp(email, otp);
        toast.success("Email verified successfully!", { icon: "✅" });
        setStep(3);
      } catch (err) {
        toast.error(err.message || "OTP verification failed.");
      } finally {
        setIsLoading(false);
      }
    } else if (step === 3) {
      const isValid = validate({ username, password, confirmPassword });
      if (!isValid) return;
      if (usernameAvailable === false) {
        setFieldError("username", "Username is already taken");
        return;
      }

      try {
        setIsLoading(true);
        await authService.registerUser(username, password, email);
        setShowSuccessOverlay(true);
        setTimeout(() => {
          setShowSuccessOverlay(false);
          navigate("/login");
        }, 2200);
      } catch (err) {
        toast.error(err.message || "Registration failed.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthLayout>
      <Toaster position="top-right" />
      <AuthCard>
        {showSuccessOverlay ? (
          <SuccessScreen
            title="Account Created Successfully"
            subtitle="Your account has been created successfully."
          />
        ) : (
          <>
            {/* Modular Header */}
            <AuthHeader
              title={
                step === 1
                  ? "Create Account"
                  : step === 2
                  ? "Email Verification"
                  : "Account Creation"
              }
              subtitle={
                step === 1
                  ? "Step 1 of 3 — Email Verification"
                  : step === 2
                  ? "Step 2 of 3 — OTP Verification"
                  : "Step 3 of 3 — Setup Credentials"
              }
              onBackClick={step > 1 ? () => setStep(step - 1) : null}
              backTo={step === 1 ? "/" : null}
            />

            {/* Step Indicators */}
            <StepIndicator currentStep={step} />

            {/* Action forms */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* STEP 1: Enter email */}
              {step === 1 && (
                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  disabled={isLoading}
                />
              )}

              {/* STEP 2: Verify OTP */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Readonly email wrapper */}
                  <div className="bg-white/45 p-4 border border-white/20 rounded-2xl flex justify-between items-center shadow-sm">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block leading-none">Code sent to</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1 truncate">{email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[10px] sm:text-xs font-bold text-indigo-650 hover:text-indigo-755 uppercase tracking-widest transition cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Segmented digits */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest text-center mb-3">
                      Enter 6-Digit Code
                    </label>
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      disabled={isLoading}
                    />
                    {errors.otp && (
                      <p className="text-xs text-red-650 font-bold text-center mt-2">{errors.otp}</p>
                    )}

                    {/* Mock OTP Helper Badge (Development Mode) */}
                    <div className="mt-4 bg-slate-50 border border-slate-200/60 p-3 rounded-2xl text-center shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                      <span className="text-[9px] text-indigo-650 font-black uppercase tracking-widest block mb-0.5">Development Mode</span>
                      <p className="text-xs text-slate-500 font-semibold leading-none">
                        Mock OTP: <strong className="text-slate-800 font-black">123456</strong>
                      </p>
                    </div>
                  </div>

                  {/* Resend timers */}
                  <CountdownTimer
                    seconds={timerSeconds}
                    isFinished={isTimerFinished}
                    onResend={handleResendOtp}
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* STEP 3: Setup credentials */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Username check */}
                  <div className="space-y-1 relative">
                    <InputField
                      label="Username"
                      type="text"
                      placeholder="Sarah_Jenkins"
                      icon={User}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={handleUsernameBlur}
                      error={errors.username}
                      success={usernameAvailable === true ? "Username is available!" : null}
                      disabled={isLoading}
                    />
                    {usernameChecking && (
                      <div className="absolute right-4.5 top-11.5">
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  <PasswordInput
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    disabled={isLoading}
                    showStrength={true}
                  />

                  <InputField
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    icon={KeyRound}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Submit CTA */}
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                variant="primary"
                className="mt-2"
              >
                {step === 1 && "Send OTP"}
                {step === 2 && "Verify OTP"}
                {step === 3 && "Create Account"}
              </LoadingButton>
            </form>
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
}

export default SignupPage;
