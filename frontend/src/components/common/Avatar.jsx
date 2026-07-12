import React, { useState } from "react";

const sizes = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs font-semibold",
  md: "w-10 h-10 text-sm font-semibold",
  lg: "w-16 h-16 text-lg font-bold",
  xl: "w-20 h-20 text-2xl font-bold",
};

function Avatar({
  src,
  name = "User",
  size = "md",
  className = "",
  status, // "online" | "offline" | undefined
  ...props
}) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (fullName) => {
    const parts = fullName.split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const hasImage = src && !imgError;

  return (
    <div className="relative inline-flex flex-shrink-0">
      <div
        className={`
          flex items-center justify-center rounded-full overflow-hidden select-none bg-slate-100 text-slate-700 border border-slate-200
          ${sizes[size] || sizes.md}
          ${className}
        `}
        {...props}
      >
        {hasImage ? (
          <img
            src={src}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={`
            absolute bottom-0 right-0 block rounded-full ring-2 ring-white
            ${size === "xs" || size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5"}
            ${status === "online" ? "bg-emerald-500" : "bg-slate-400"}
          `}
        />
      )}
    </div>
  );
}

export default Avatar;
