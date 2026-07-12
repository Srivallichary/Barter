import React from "react";
import { Loader2, Check } from "lucide-react";

function LoadingButton({
  children,
  isLoading = false,
  isSuccess = false,
  disabled = false,
  type = "submit",
  variant = "primary", // "primary" | "secondary" | "outline" | "ghost"
  icon: Icon,
  className = "",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-bold tracking-wide transition-all duration-300 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-[0_4px_15px_rgba(99,102,241,0.15)]",
    secondary:
      "bg-slate-100/90 text-slate-700 hover:bg-slate-200 active:bg-slate-300",
    outline:
      "border border-slate-300/80 bg-white/40 backdrop-blur-sm text-slate-700 hover:bg-white/80 active:bg-slate-100/60",
    ghost:
      "text-slate-650 hover:bg-slate-100/50 active:bg-slate-200/50 hover:text-slate-900",
  };

  const classes = `
    w-full py-3.5 px-6 rounded-2xl gap-2 text-xs sm:text-sm uppercase tracking-widest
    ${baseClasses} ${variants[variant]} ${className}
  `;

  return (
    <button
      type={type}
      disabled={disabled || isLoading || isSuccess}
      className={classes}
      {...props}
    >
      {isLoading && <Loader2 size={18} className="animate-spin shrink-0" />}
      {isSuccess && <Check size={18} className="text-emerald-300 shrink-0 stroke-[2.5]" />}
      {!isLoading && !isSuccess && Icon && <Icon size={18} className="shrink-0" />}
      <span>
        {isSuccess ? "Success" : children}
      </span>
    </button>
  );
}

export default LoadingButton;
