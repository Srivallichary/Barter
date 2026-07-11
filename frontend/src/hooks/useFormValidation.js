import { useState, useCallback } from "react";

export function useFormValidation(initialRules = {}) {
  const [errors, setErrors] = useState({});

  const validate = useCallback((values) => {
    const newErrors = {};
    
    Object.keys(values).forEach((field) => {
      const value = values[field];
      const rules = initialRules[field];
      if (!rules) return;

      if (rules.required && (value === undefined || value === null || String(value).trim() === "")) {
        newErrors[field] = rules.requiredMessage || `${field} is required`;
      } else if (rules.pattern && !rules.pattern.test(value)) {
        newErrors[field] = rules.patternMessage || `Invalid ${field} format`;
      } else if (rules.minLength && String(value).length < rules.minLength) {
        newErrors[field] = rules.minLengthMessage || `${field} must be at least ${rules.minLength} characters`;
      } else if (rules.custom && !rules.custom(value, values)) {
        newErrors[field] = rules.customMessage || `Invalid ${field}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [initialRules]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setFieldError = useCallback((field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  return {
    errors,
    validate,
    clearErrors,
    setFieldError,
  };
}

export default useFormValidation;
