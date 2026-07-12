import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-indigo-650 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-[0_4px_15px_rgba(99,102,241,0.15)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.25)]",
  secondary:
    "bg-slate-100/90 text-slate-700 hover:bg-slate-200 active:bg-slate-350",
  outline:
    "border border-slate-300/80 bg-white/40 backdrop-blur-sm text-slate-750 hover:bg-white/80 active:bg-slate-100/60",
  ghost:
    "text-slate-650 hover:bg-slate-100/50 active:bg-slate-200/50 hover:text-slate-900",
  danger:
    "bg-red-650 text-white hover:bg-red-750 active:bg-red-850 shadow-sm",
};

const sizes = {
  sm: "px-4 py-2 text-xs sm:text-sm gap-2 rounded-xl",
  md: "px-5.5 py-3 text-sm sm:text-base gap-2.5 rounded-2xl",
  lg: "px-7.5 py-4 text-base sm:text-lg gap-3 rounded-2xl",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  href,
  to,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-bold tracking-wide transition-all duration-300 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2";

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {isLoading && <Loader2 size={18} className="animate-spin shrink-0" />}
      {!isLoading && Icon && iconPosition === "left" && <Icon size={18} className="shrink-0" />}
      {children}
      {!isLoading && Icon && iconPosition === "right" && <Icon size={18} className="shrink-0" />}
    </>
  );

  // Render as React Router Link
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  // Render as anchor tag
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  );
}

export default Button;
