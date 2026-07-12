import React from "react";
import Button from "./Button";

function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onActionClick,
  actionIcon,
  className = "",
  ...props
}) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center p-8 sm:p-12 
        rounded-3xl border border-dashed border-slate-300/80 bg-white/40 backdrop-blur-sm
        ${className}
      `}
      {...props}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-indigo-50/60 text-indigo-650 flex items-center justify-center mb-5 shadow-sm border border-indigo-100/30">
          <Icon size={26} />
        </div>
      )}
      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{title}</h3>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed font-medium">
        {description}
      </p>
      {actionText && onActionClick && (
        <Button
          onClick={onActionClick}
          variant="primary"
          size="sm"
          icon={actionIcon}
          className="mt-6"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
