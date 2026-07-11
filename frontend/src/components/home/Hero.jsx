import React from "react";
import { ArrowRight, Recycle } from "lucide-react";
import Button from "../common/Button";

function Hero() {
  const stats = [
    { value: "1,200+", label: "Items Listed" },
    { value: "850+", label: "Successful Swaps" },
    { value: "2.4 Tons", label: "CO2 Saved (Est.)" },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 border-b border-slate-100/50">
      {/* Subtle top decoration grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none opacity-50" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        
        {/* Subtle tagline badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-200/80 bg-slate-50 text-[11px] sm:text-xs uppercase font-extrabold text-slate-500 tracking-widest">
          <Recycle size={14} className="text-indigo-500 animate-spin-slow" />
          Eco-Friendly Community Exchange
        </div>

        {/* Headings */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Trade Smarter. <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-indigo-650 to-indigo-500 bg-clip-text text-transparent">
              Exchange Without Money.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-500 leading-relaxed font-semibold">
            Join a growing community where people exchange books, electronics, furniture, clothing, and more without spending money.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
          <Button
            to="/login"
            variant="primary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            className="w-full sm:w-auto shadow-sm"
          >
            Explore Listings
          </Button>
          <Button
            to="/signup"
            variant="outline"
            size="md"
            className="w-full sm:w-auto"
          >
            Start Bartering
          </Button>
        </div>

        {/* Statistics dashboard row */}
        <div className="pt-10 border-t border-slate-100/80 max-w-xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;