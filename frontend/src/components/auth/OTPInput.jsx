import React, { useRef, useEffect } from "react";

function OTPInput({ value, onChange, length = 6, disabled = false }) {
  const inputsRef = useRef([]);

  // Split values into array of length
  const otpArray = value.split("").slice(0, length);
  while (otpArray.length < length) {
    otpArray.push("");
  }

  useEffect(() => {
    // Focus the first input on mount
    if (inputsRef.current[0] && !disabled) {
      inputsRef.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    // Allow only numeric digits
    if (val && !/^\d$/.test(val)) return;

    const newOtpArray = [...otpArray];
    newOtpArray[index] = val;
    const newOtpString = newOtpArray.join("");
    onChange(newOtpString);

    // Jump to next input if filled
    if (val && index < length - 1 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtpArray = [...otpArray];
      
      // If current is empty, clear previous and focus it
      if (!newOtpArray[index] && index > 0 && inputsRef.current[index - 1]) {
        newOtpArray[index - 1] = "";
        inputsRef.current[index - 1].focus();
      } else {
        newOtpArray[index] = "";
      }
      
      onChange(newOtpArray.join(""));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const newOtpString = pastedData.slice(0, length);
    onChange(newOtpString);

    // Focus last or appropriate input
    const focusIndex = Math.min(newOtpString.length, length - 1);
    if (inputsRef.current[focusIndex]) {
      inputsRef.current[focusIndex].focus();
    }
  };

  return (
    <div className="flex justify-between gap-2.5 max-w-sm mx-auto" onPaste={handlePaste}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          type="text"
          maxLength={1}
          disabled={disabled}
          ref={(el) => (inputsRef.current[idx] = el)}
          value={otpArray[idx]}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className="w-12 h-14 text-center text-lg sm:text-xl font-bold rounded-2xl border border-slate-300/80 bg-white/45 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none disabled:bg-slate-100/50 disabled:text-slate-400"
        />
      ))}
    </div>
  );
}

export default OTPInput;
