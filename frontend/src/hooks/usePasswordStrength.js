import { useState, useEffect } from "react";

export function usePasswordStrength(password = "") {
  const [strength, setStrength] = useState({
    label: "",
    color: "bg-slate-200",
    width: "w-0",
    textClass: "text-slate-400",
    score: 0, // 0 to 3
  });

  useEffect(() => {
    if (!password) {
      setStrength({
        label: "",
        color: "bg-slate-200",
        width: "w-0",
        textClass: "text-slate-400",
        score: 0,
      });
      return;
    }

    if (password.length < 6) {
      setStrength({
        label: "Weak",
        color: "bg-red-500",
        width: "w-1/3",
        textClass: "text-red-500",
        score: 1,
      });
      return;
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const criteriaCount = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;

    if (password.length >= 8 && criteriaCount >= 3) {
      setStrength({
        label: "Strong",
        color: "bg-emerald-500",
        width: "w-full",
        textClass: "text-emerald-500",
        score: 3,
      });
    } else {
      setStrength({
        label: "Medium",
        color: "bg-amber-500",
        width: "w-2/3",
        textClass: "text-amber-500",
        score: 2,
      });
    }
  }, [password]);

  return strength;
}

export default usePasswordStrength;
