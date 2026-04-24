"use client";

import { forwardRef } from "react";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  /** Raw numeric value as a string (e.g. "115000"). */
  value: string;
  /** Called with the raw numeric string (digits only). */
  onChange: (value: string) => void;
}

const formatWithCommas = (raw: string): string => {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
};

/** Text input that shows comma-separated thousands but stores raw digits. */
export const PriceInput = forwardRef<HTMLInputElement, Props>(function PriceInput(
  { value, onChange, className, placeholder, inputMode = "numeric", dir = "ltr", ...rest },
  ref
) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    onChange(digits);
  };

  return (
    <input
      ref={ref}
      type="text"
      inputMode={inputMode}
      dir={dir}
      value={formatWithCommas(value)}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      {...rest}
    />
  );
});
