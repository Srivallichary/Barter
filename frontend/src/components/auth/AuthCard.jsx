import React from "react";

function AuthCard({ children, className = "" }) {
  return (
    <div
      className={`
        w-full max-w-md glass-card p-8 sm:p-10 rounded-3xl shadow-xl space-y-8 bg-white/65 backdrop-blur-md
        animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default AuthCard;
