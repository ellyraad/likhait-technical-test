/**
 * Reusable SelectBox component
 */

import React from "react";
import { COLORS } from "../constants/colors";

type SelectOption<T extends string | number> = {
  value: T;
  label: string;
};

interface SelectBoxProps<T extends string | number>
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "value" | "onChange"
  > {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: Array<SelectOption<T>>;
  value: T | null;
  onValueChange: (value: T | null) => void;
}

export function SelectBox<T extends string | number>({
  label,
  error,
  fullWidth = false,
  options,
  value,
  onValueChange,
  ...props
}: SelectBoxProps<T>) {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: fullWidth ? "100%" : "auto",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: COLORS.text.primary,
  };

  const selectStyle: React.CSSProperties = {
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    border: `1px solid ${error ? COLORS.danger : COLORS.border}`,
    borderRadius: "0.375rem",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: COLORS.background.main,
    color: COLORS.text.primary,
    cursor: "pointer",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    color: COLORS.danger,
    marginTop: "-0.25rem",
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedOption = options.find(
      (option) => String(option.value) === selectedValue,
    );

    onValueChange(selectedOption?.value ?? null);
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <select
        style={selectStyle}
        value={value === null ? "" : String(value)}
        onChange={handleChange}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}
