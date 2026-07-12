import React from "react";

const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      endIcon: EndIcon,
      onEndIconClick,
      className = "",
      containerClassName = "",
      fullWidth = true,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-widest mb-2"
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
            ref={ref}
            className={`
              block w-full rounded-2xl border bg-white/45 backdrop-blur-sm py-3.5 text-sm sm:text-base text-slate-900 transition-all duration-300
              placeholder:text-slate-400
              focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none
              disabled:bg-slate-100/50 disabled:text-slate-500 disabled:border-slate-200
              ${Icon ? "pl-12" : "pl-5"}
              ${EndIcon ? "pr-12" : "pr-5"}
              ${
                error
                  ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500/10"
                  : "border-slate-300/80 hover:border-slate-400"
              }
              ${className}
            `}
            {...props}
          />
          {EndIcon && (
            <button
              type="button"
              onClick={onEndIconClick}
              disabled={!onEndIconClick}
              className={`absolute inset-y-0 right-0 pr-4.5 flex items-center text-slate-400 ${
                onEndIconClick ? "cursor-pointer hover:text-slate-600" : "pointer-events-none"
              }`}
            >
              <EndIcon size={20} />
            </button>
          )}
        </div>
        {error && (
          <p className="mt-2 text-xs sm:text-sm text-red-600 font-bold">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-2 text-xs sm:text-sm text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
