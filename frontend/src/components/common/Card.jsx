import React from "react";

function Card({
  children,
  className = "",
  hoverable = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        glass-card rounded-3xl overflow-hidden
        ${
          hoverable
            ? "transition-all duration-350 ease-out hover:shadow-[0_15px_35px_rgba(15,23,42,0.06)] hover:border-slate-400/50 hover:-translate-y-1"
            : ""
        }
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
