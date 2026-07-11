import React from "react";

function StepIndicator({ currentStep, totalSteps = 3, labels = ["Email", "Verify", "Create"] }) {
  return (
    <div className="flex items-center justify-between max-w-xs mx-auto mb-8 relative">
      {/* Background connector line */}
      <div className="absolute left-2 right-2 top-3.5 h-[1px] bg-slate-200/60 -z-10" />

      {/* Progress connector line */}
      <div 
        className="absolute left-2 top-3.5 h-[1px] bg-indigo-500 -z-10 transition-all duration-300"
        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 96}%` }}
      />

      {Array.from({ length: totalSteps }).map((_, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
            <div
              className={`
                w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border
                ${
                  isActive
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-110"
                    : isCompleted
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                    : "bg-white border-slate-200 text-slate-400"
                }
              `}
            >
              {stepNum}
            </div>
            {labels[idx] && (
              <span 
                className={`
                  text-[10px] uppercase font-bold tracking-widest transition-colors duration-300
                  ${isActive ? "text-indigo-600 font-extrabold" : isCompleted ? "text-slate-500" : "text-slate-400"}
                `}
              >
                {labels[idx]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;
