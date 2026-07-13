import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function AuthHeader({ title, subtitle, showLogo = false, backTo, onBackClick }) {
  return (
    <div className="space-y-4 w-full">
      {/* Optional Back Button */}
      {(backTo || onBackClick) && (
        <div className="animate-in fade-in duration-200">
          {backTo ? (
            <Link
              to={backTo}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition"
            >
              <ArrowLeft size={14} />
              Back
            </Link>
          ) : (
            <button
              type="button"
              onClick={onBackClick}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          )}
        </div>
      )}

      {/* Header Info */}
      <div className="space-y-2">
        {showLogo && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#51D95F] flex items-center justify-center text-white font-extrabold text-sm shadow-md">
              B
            </div>
            <span className="text-sm font-black tracking-wider uppercase text-slate-900">Barter</span>
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl font-black text-slate-955 tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm font-semibold text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthHeader;
