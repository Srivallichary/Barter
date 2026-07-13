import React from "react";
import { Recycle, Compass } from "lucide-react";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50/20 flex flex-col lg:flex-row font-sans antialiased">
      {/* Left Panel: Brand info */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-16 flex-col justify-between relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_30px] opacity-40 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#51D95F] flex items-center justify-center text-white font-extrabold text-sm shadow-md">
            B
          </div>
          <span className="text-sm font-black tracking-wider uppercase">Barter</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <h1 className="text-4xl font-black leading-tight tracking-tight">
            Exchange gear, save money, live sustainably.
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            Join thousands of neighbors swapping books, dorm equipment, bicycles, and games cash-free in a trusted community.
          </p>
        </div>

        <div className="relative z-10 pt-8 border-t border-slate-800 flex gap-10 text-xs">
          <div className="flex items-center gap-2">
            <Recycle size={16} className="text-[#51D95F]" />
            <span className="font-semibold text-slate-300">100% Cashless Swapping</span>
          </div>
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-[#51D95F]" />
            <span className="font-semibold text-slate-300">Local Neighborhood Audits</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Content slot */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-20 relative bg-slate-50/20">
        <div className="w-full max-w-md flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
