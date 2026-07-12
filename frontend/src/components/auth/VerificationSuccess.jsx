import React from "react";
import { Check, Sparkles } from "lucide-react";

function VerificationSuccess({ title = "Verified!", subtitle = "Redirecting you shortly..." }) {
  return (
    <div className="text-center py-8 space-y-6 animate-in zoom-in-95 fade-in duration-300">
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
        
        {/* Rotating Sparkles icon */}
        <div className="absolute -top-1 -right-1 text-amber-500 animate-spin-slow">
          <Sparkles size={20} className="fill-amber-500" />
        </div>

        {/* Checkmark circle container */}
        <div className="w-16 h-16 rounded-full bg-emerald-50/90 text-emerald-600 flex items-center justify-center border border-emerald-250/30 shadow-md">
          <Check size={32} className="stroke-[3]" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 font-extrabold uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );
}

export default VerificationSuccess;
