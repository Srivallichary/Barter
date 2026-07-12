import React from "react";

function CountdownTimer({ seconds, isFinished, onResend, disabled = false }) {
  return (
    <div className="text-center pt-2">
      {isFinished ? (
        <button
          type="button"
          onClick={onResend}
          disabled={disabled}
          className="text-xs font-black text-indigo-650 hover:text-indigo-755 transition uppercase tracking-widest cursor-pointer disabled:opacity-50"
        >
          Resend Code
        </button>
      ) : (
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
          Resend code in <span className="text-indigo-600 font-extrabold">{seconds}s</span>
        </p>
      )}
    </div>
  );
}

export default CountdownTimer;
