import React from "react";

function Divider({ children = "Or" }) {
  return (
    <div className="relative flex py-2 items-center w-full">
      <div className="flex-grow border-t border-slate-200/60"></div>
      <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-widest select-none">
        {children}
      </span>
      <div className="flex-grow border-t border-slate-200/60"></div>
    </div>
  );
}

export default Divider;
