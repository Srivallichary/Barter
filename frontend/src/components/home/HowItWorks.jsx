import React from "react";
import { Search, RefreshCw, Handshake } from "lucide-react";
import Card from "../common/Card";
import SectionTitle from "../common/SectionTitle";

function HowItWorks() {
  const steps = [
    {
      stepNum: "01",
      icon: <Search size={24} className="text-emerald-600" />,
      title: "Discover Gear",
      description: "Search the catalog for books, equipment, household items, and gear listed by neighbors in your area.",
    },
    {
      stepNum: "02",
      icon: <RefreshCw size={24} className="text-emerald-600" />,
      title: "Propose a Barter",
      description: "Found something? Offer one of your listings in exchange. No credit card or cash required.",
    },
    {
      stepNum: "03",
      icon: <Handshake size={24} className="text-emerald-600 animate-pulse" />,
      title: "Meet & Swap",
      description: "Chat, agree on a safe public meeting spot (like a library or local coffee shop), verify items, and complete the swap.",
    },
  ];

  return (
    <section className="bg-slate-50 py-20 border-y border-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Swapping in 3 Easy Steps"
          subtitle="Join the sustainable campus trade network and save money on essential items."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative">
          {/* Connector lines (Desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-slate-200/60 -translate-y-12 -z-10"></div>

          {steps.map((step, index) => (
            <Card
              key={index}
              className="bg-white p-8 text-center border border-slate-100 flex flex-col items-center hover:translate-y-[-4px] transition-all duration-300 relative"
            >
              {/* Step number badge */}
              <div className="absolute top-4 right-4 text-xs font-black text-emerald-100 tracking-widest bg-emerald-50/50 px-2.5 py-1 rounded-md">
                STEP {step.stepNum}
              </div>

              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm border border-emerald-100/30">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;