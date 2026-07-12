import React, { useEffect } from "react";
import { X } from "lucide-react";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md", // "sm" | "md" | "lg" | "xl"
  className = "",
  ...props
}) {
  // Prevent body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/25 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`
          relative glass-modal w-full rounded-3xl flex flex-col max-h-[90vh] z-10 overflow-hidden
          animate-in fade-in zoom-in-95 duration-200 ease-out
          ${sizeClasses[size] || sizeClasses.md}
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5.5 border-b border-white/20">
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-650 hover:bg-slate-100/50 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6.5 text-sm sm:text-base leading-relaxed text-slate-755">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-5 border-t border-white/20 bg-slate-50/50 flex items-center justify-end gap-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
