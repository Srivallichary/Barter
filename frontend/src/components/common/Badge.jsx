import React from "react";

const dotColors = {
  indigo: "bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.4)]",
  success: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]",
  blue: "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]",
  yellow: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
  red: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]",
};

function Badge({
  children,
  variant = "slate",
  className = "",
  size = "md",
  ...props
}) {
  const sizeStyles =
    size === "sm"
      ? "px-2.5 py-0.5 text-xs tracking-wider font-bold gap-1.5"
      : "px-3 py-1.5 text-xs sm:text-sm font-semibold gap-2";
  
  const hasDot = dotColors[variant];

  return (
    <span
      className={`
        inline-flex items-center rounded-full border leading-none uppercase backdrop-blur-sm
        bg-slate-100/75 border-slate-200/40 text-slate-650
        ${sizeStyles}
        ${className}
      `}
      {...props}
    >
      {hasDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />
      )}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
