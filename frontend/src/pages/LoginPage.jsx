import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, LogIn } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Context and Services
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/auth";
import useFormValidation from "../hooks/useFormValidation";

// Reusable Auth Components
import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import AuthHeader from "../components/auth/AuthHeader";
import InputField from "../components/auth/InputField";
import PasswordInput from "../components/auth/PasswordInput";
import LoadingButton from "../components/auth/LoadingButton";

function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation configuration
  const validationRules = {
    username: {
      required: true,
      requiredMessage: "Username is required",
      minLength: 4,
      minLengthMessage: "Username must be at least 4 characters"
    },
    password: {
      required: true,
      requiredMessage: "Password is required",
      minLength: 6,
      minLengthMessage: "Password must be at least 6 characters"
    }
  };

  const { errors, validate, clearErrors } = useFormValidation(validationRules);

  // Checks whether the required fields are filled and valid to enable the submit trigger
  const isFormValid = username.trim().length >= 4 && password.length >= 6;

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validate({ username, password });
    if (!isValid) return;

    try {
      setIsLoading(true);
      const loggedUser = await login(username, password, rememberMe);
      
      toast.success(`Welcome back, ${loggedUser.name}!`, { icon: "👋" });
      setTimeout(() => {
        navigate(location.state?.from?.pathname || "/", { replace: true });
      }, 1200);
    } catch (err) {
      toast.error(err.message || "Invalid credentials. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Toaster position="top-right" />
      <AuthCard>
        {/* Header information */}
        <AuthHeader
          title="Welcome Back"
          subtitle={
            <span>
              New to Barter?{" "}
              <Link to="/signup" className="text-indigo-650 hover:text-indigo-705 font-bold transition">
                Create an account
              </Link>
            </span>
          }
          backTo="/"
        />

        {/* Login credentials form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <InputField
            label="Username"
            type="text"
            placeholder="your_username"
            icon={User}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
            disabled={isLoading}
          />

          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            disabled={isLoading}
          />

          {/* Remember Me / Forgot Password option row */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-200 rounded cursor-pointer disabled:opacity-50"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-xs font-bold uppercase tracking-widest text-slate-500 cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            <Link
              to="/forgot-password"
              className="text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-755 transition cursor-pointer"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit action panel */}
          <div className="space-y-4 pt-2">
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              disabled={!isFormValid}
              icon={LogIn}
            >
              {isLoading ? "Logging in..." : "Login"}
            </LoadingButton>

          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default LoginPage;
