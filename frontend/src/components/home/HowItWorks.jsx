import React from "react";
import { Search, RefreshCw, Handshake } from "lucide-react";
import Card from "../common/Card";
import SectionTitle from "../common/SectionTitle";

function HowItWorks() {
  const steps = [
    {
      stepNum: "01",
      icon: <Search size={24} className="text-indigo-600" />,
      title: "Discover items",
      description: "Search listings by category, location, or desired swap so you can find the right match fast.",
    },
    {
      stepNum: "02",
      icon: <RefreshCw size={24} className="text-indigo-600" />,
      title: "Propose your offer",
      description: "Send a swap request with clear item details and agree on the best exchange terms.",
    },
    {
      stepNum: "03",
      icon: <Handshake size={24} className="text-indigo-600" />,
      title: "Meet & complete",
      description: "Chat with the other member, choose a safe meetup spot, and finish the swap confidently.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="How Barter Works"
          subtitle="Simple, secure swaps in three easy steps."
        />

        <div className="grid gap-6 lg:grid-cols-3 mt-12">
          {steps.map((step) => (
            <Card key={step.stepNum} className="rounded-[2rem] border border-slate-200/70 bg-slate-50 p-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
                {step.icon}
              </div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-3">Step {step.stepNum}</p>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-sm leading-7 text-slate-600">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;