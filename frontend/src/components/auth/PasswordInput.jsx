import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import Input from "../common/Input";

function PasswordInput({
  label = "Password",
  value,
  onChange,
  error,
  placeholder = "••••••••",
  disabled = false,
  showStrength = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const getStrength = (pass) => {
    if (!pass) return { label: "", color: "bg-slate-200", width: "w-0", textClass: "text-slate-400" };
    if (pass.length < 6) {
      return { label: "Weak", color: "bg-red-500", width: "w-1/3", textClass: "text-red-500" };
    }
    
    // Check complexity
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasDigit = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    
    const criteriaCount = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;
    
    if (pass.length >= 8 && criteriaCount >= 3) {
      return { label: "Strong", color: "bg-emerald-500", width: "w-full", textClass: "text-emerald-500" };
    }
    
    return { label: "Medium", color: "bg-amber-500", width: "w-2/3", textClass: "text-amber-500" };
  };

  const strength = getStrength(value);

  return (
    <div className="space-y-2">
      <Input
        label={label}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        icon={Lock}
        endIcon={showPassword ? EyeOff : Eye}
        onEndIconClick={() => setShowPassword(!showPassword)}
        value={value}
        onChange={onChange}
        error={error}
        disabled={disabled}
        required
        {...props}
      />

      {showStrength && value && (
        <div className="space-y-1.5 px-1 pt-1 animate-in fade-in duration-200">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
            <span className="text-slate-400">Password Strength</span>
            <span className={strength.textClass}>{strength.label}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden border border-white/20">
            <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PasswordInput;
