import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, KeyRound, Mail } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { authService } from "../services/auth";
import { AuthContext } from "../context/AuthContext";
import usePasswordStrength from "../hooks/usePasswordStrength";
import useFormValidation from "../hooks/useFormValidation";

import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import AuthHeader from "../components/auth/AuthHeader";
import InputField from "../components/auth/InputField";
import PasswordInput from "../components/auth/PasswordInput";
import LoadingButton from "../components/auth/LoadingButton";
import SuccessScreen from "../components/auth/SuccessScreen";

function SignupPage() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const passwordStrength = usePasswordStrength(password);

  const validationRules = {
    email: {
      required: true,
      requiredMessage: "Email address is required",
      pattern: /^\S+@\S+\.\S+$/,
      patternMessage: "Please enter a valid email address"
    },
    username: {
      required: true,
      requiredMessage: "Username is required",
      minLength: 4,
      minLengthMessage: "Username must be at least 4 characters",
      custom: (val) => /^[a-zA-Z0-9_]{4,15}$/.test(val),
      customMessage: "Username must be 4-15 characters and contain only letters, numbers, or underscores"
    },
    password: {
      required: true,
      requiredMessage: "Password is required",
      custom: () => passwordStrength.score === 3,
      customMessage: "Password must contain at least 8 characters, uppercase, lowercase, numbers, and symbols"
    },
    confirmPassword: {
      required: true,
      requiredMessage: "Please confirm your password",
      custom: (val) => val === password,
      customMessage: "Passwords do not match"
    }
  };

  const { errors, validate, setFieldError } = useFormValidation(validationRules);

  const handleUsernameBlur = async () => {
    const cleanUsername = username.trim();
    if (cleanUsername.length < 4 || !/^[a-zA-Z0-9_]{4,15}$/.test(cleanUsername)) {
      setUsernameAvailable(null);
      return;
    }

    try {
      setUsernameChecking(true);
      const data = await authService.checkUsernameAvailability(cleanUsername);
      setUsernameAvailable(data.available);
      if (!data.available) {
        setFieldError("username", "This username is already taken");
      }
    } catch {
      setUsernameAvailable(null);
    } finally {
      setUsernameChecking(false);
    }
  };

  useEffect(() => {
    setUsernameAvailable(null);
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validate({ email, username, password, confirmPassword });
    if (!isValid) return;
    if (usernameAvailable === false) {
      setFieldError("username", "Username is already taken");
      return;
    }

    try {
      setIsLoading(true);
      await register(username, password, email);
      setShowSuccessOverlay(true);
      setTimeout(() => {
        setShowSuccessOverlay(false);
        navigate("/profile");
      }, 2200);
    } catch (err) {
      toast.error(err?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Toaster position="top-right" />
      <AuthCard>
        {showSuccessOverlay ? (
          <SuccessScreen
            title="Account Created"
            subtitle="Your account is ready. Upload your college ID from your profile to complete verification."
          />
        ) : (
          <>
            <AuthHeader
              title="Create your account"
              subtitle="Sign up now and verify your student identity later in your profile."
            />

            <form className="space-y-6" onSubmit={handleSubmit}>
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

              <InputField
                label="Username"
                type="text"
                placeholder="your_username"
                icon={User}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={handleUsernameBlur}
                error={errors.username}
                success={usernameAvailable === true ? "Username is available!" : null}
                disabled={isLoading}
              />

              {usernameChecking && (
                <p className="text-xs text-slate-500">Checking username availability...</p>
              )}

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

              <LoadingButton type="submit" isLoading={isLoading} variant="primary" className="mt-2">
                Create Account
              </LoadingButton>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                Log in here
              </Link>
            </div>
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
}

export default SignupPage;
