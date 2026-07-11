import React from "react";

function SectionTitle({
  title,
  subtitle,
  centered = true,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  ...props
}) {
  return (
    <div
      className={`
        mb-10
        ${centered ? "text-center mx-auto max-w-2xl" : "text-left"}
        ${className}
      `}
      {...props}
    >
      <h2
        className={`
          text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight
          ${titleClassName}
        `}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`
            mt-3 text-lg text-slate-500 leading-relaxed
            ${subtitleClassName}
          `}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;
