import React from "react";
import { Loader2 } from "lucide-react";

function Loader({
  fullPage = false,
  size = "md",
  className = "",
  text = "Loading...",
  ...props
}) {
  const spinnerSizes = {
    sm: 24,
    md: 40,
    lg: 56,
  };

  const loaderContent = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} {...props}>
      <Loader2
        size={spinnerSizes[size] || spinnerSizes.md}
        className="animate-spin text-indigo-600"
      />
      {text && <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/60 backdrop-blur-md">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
}

export default Loader;
