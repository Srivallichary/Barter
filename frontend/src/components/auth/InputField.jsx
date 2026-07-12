import React from "react";
import { Check } from "lucide-react";

function InputField({
  label,
  error,
  success,
  icon: Icon,
  disabled = false,
  fullWidth = true,
  className = "",
  id,
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${fullWidth ? "w-full" : ""} space-y-2`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
            <Icon size={20} />
          </div>
        )}
        <input
          id={inputId}
          disabled={disabled}
          className={`
            block w-full rounded-2xl border bg-white/45 backdrop-blur-sm py-3.5 text-sm sm:text-base text-slate-900 transition-all duration-300
            placeholder:text-slate-400
            focus:bg-white focus:outline-none
            disabled:bg-slate-100/50 disabled:text-slate-400 disabled:border-slate-200
            ${Icon ? "pl-12" : "pl-5"}
            ${success ? "pr-12" : "pr-5"}
            ${
              error
                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : success
                ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                : "border-slate-300/80 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            }
            ${className}
          `}
          {...props}
        />
        {success && (
          <div className="absolute inset-y-0 right-0 pr-4.5 flex items-center text-emerald-500">
            <Check size={20} className="stroke-[2.5]" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-650 font-bold px-1">{error}</p>
      )}
      {!error && success && typeof success === "string" && (
        <p className="text-xs text-emerald-600 font-bold px-1">{success}</p>
      )}
    </div>
  );
}

export default InputField;
