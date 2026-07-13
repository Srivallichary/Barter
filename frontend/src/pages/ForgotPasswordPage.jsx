import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Services and Hooks
import { authService } from "../services/auth";
import useOtpTimer from "../hooks/useOtpTimer";
import usePasswordStrength from "../hooks/usePasswordStrength";
import useFormValidation from "../hooks/useFormValidation";

// Reusable Components
import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import AuthHeader from "../components/auth/AuthHeader";
import StepIndicator from "../components/auth/StepIndicator";
import InputField from "../components/auth/InputField";
import OTPInput from "../components/auth/OTPInput";
import CountdownTimer from "../components/auth/CountdownTimer";
import PasswordInput from "../components/auth/PasswordInput";
import LoadingButton from "../components/auth/LoadingButton";
import SuccessScreen from "../components/auth/SuccessScreen";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Step states: 1 (Email), 2 (OTP), 3 (New Password)
  const [step, setStep] = useState(1);

  // Form inputs
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Loading/Success overlays
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Custom hooks
  const { seconds: timerSeconds, start: startTimer, reset: resetTimer, isFinished: isTimerFinished } = useOtpTimer(30);
  const passwordStrength = usePasswordStrength(newPassword);

  // Validation rules mapping
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
    newPassword: {
      required: true,
      requiredMessage: "New password is required",
      custom: () => {
        // Password must qualify as Strong (score === 3)
        return passwordStrength.score === 3;
      },
      customMessage: "Password must contain at least 8 characters, uppercase, lowercase, numbers, and symbols"
    },
    confirmNewPassword: {
      required: true,
      requiredMessage: "Please confirm your new password",
      custom: (val) => val === newPassword,
      customMessage: "Passwords do not match"
    }
  };

  const { errors, validate, clearErrors, setFieldError } = useFormValidation(validationRules);

  // Resend OTP trigger
  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      await authService.forgotPassword(email);
      resetTimer();
      toast.success("Verification code resent!", { icon: "📨" });
    } catch (err) {
      toast.error(err.message || "Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      const isValid = validate({ email });
      if (!isValid) return;

      try {
        setIsLoading(true);
        await authService.forgotPassword(email);
        toast.success("Verification code sent to your email!", { icon: "📨" });
        setStep(2);
        startTimer();
      } catch (err) {
        toast.error(err.message || "Failed to process request.");
      } finally {
        setIsLoading(false);
      }
    } else if (step === 2) {
      const isValid = validate({ otp });
      if (!isValid) return;

      try {
        setIsLoading(true);
        await authService.verifyOtp(email, otp);
        toast.success("Verification successful!", { icon: "✅" });
        setStep(3);
      } catch (err) {
        toast.error(err.message || "Invalid or expired code.");
      } finally {
        setIsLoading(false);
      }
    } else if (step === 3) {
      const isValid = validate({ newPassword, confirmNewPassword });
      if (!isValid) return;

      try {
        setIsLoading(true);
        await authService.resetPassword(email, otp, newPassword);
        setShowSuccessOverlay(true);
        setTimeout(() => {
          setShowSuccessOverlay(false);
          navigate("/login");
        }, 2200);
      } catch (err) {
        toast.error(err.message || "Failed to update password.");
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
            title="Password Reset Successful"
            subtitle="Your password has been updated successfully."
          />
        ) : (
          <>
            {/* Modular Header */}
            <AuthHeader
              title={
                step === 1
                  ? "Forgot Password"
                  : step === 2
                  ? "OTP Verification"
                  : "New Password"
              }
              subtitle={
                step === 1
                  ? "Step 1 of 3 — Email Verification"
                  : step === 2
                  ? "Step 2 of 3 — OTP Verification"
                  : "Step 3 of 3 — Create New Password"
              }
              onBackClick={step > 1 ? () => setStep(step - 1) : null}
              backTo={step === 1 ? "/login" : null}
            />

            {/* Step progress bar */}
            <StepIndicator currentStep={step} />

            {/* Verification form */}
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

                  {/* Segmented OTP */}
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
                  </div>

                  {/* Resend OTP counting */}
                  <CountdownTimer
                    seconds={timerSeconds}
                    isFinished={isTimerFinished}
                    onResend={handleResendOtp}
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* STEP 3: Reset password */}
              {step === 3 && (
                <div className="space-y-6">
                  <PasswordInput
                    label="New Password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={errors.newPassword}
                    disabled={isLoading}
                    showStrength={true}
                  />

                  <InputField
                    label="Confirm New Password"
                    type="password"
                    placeholder="••••••••"
                    icon={KeyRound}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    error={errors.confirmNewPassword}
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Submit trigger */}
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                variant="primary"
                className="mt-2"
              >
                {step === 1 && "Send OTP"}
                {step === 2 && "Verify OTP"}
                {step === 3 && "Reset Password"}
              </LoadingButton>
            </form>
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
