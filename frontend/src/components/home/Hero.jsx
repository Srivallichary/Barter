import React from "react";
import { ArrowRight, Recycle } from "lucide-react";
import Button from "../common/Button";

function Hero() {
  const stats = [
    { value: "1.2K+", label: "Live listings" },
    { value: "850+", label: "Swaps completed" },
    { value: "4.8★", label: "Average trust" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50 py-20">
      <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_left,_rgba(81,217,95,0.14),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(79,201,76,0.12),_transparent_34%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_bottom_left,_rgba(71,85,105,0.08),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(81,217,95,0.1),_transparent_32%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-center">
          <div className="space-y-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 backdrop-blur-sm">
              <Recycle size={16} className="text-emerald-500" />
              Eco-friendly community trading
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-tight">
              Trade better locally. <br className="hidden sm:inline" /> Keep value in your neighborhood.
            </h1>
            <p className="max-w-3xl text-base sm:text-lg text-slate-600 leading-8">
              Discover nearby items, propose swap offers, and complete safe local trades with a community-first marketplace built for students and neighbors.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button to="/login" variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Explore listings
              </Button>
              <Button to="/signup" variant="outline" size="lg" className="text-slate-700 border-slate-300 hover:bg-white">
                Start bartering
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                  <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-[2rem] overflow-hidden border border-slate-200 bg-white shadow-[0_25px_75px_rgba(15,23,42,0.08)]">
            <img
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80"
              alt="Community bartering"
              className="h-full w-full object-cover min-h-[420px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;