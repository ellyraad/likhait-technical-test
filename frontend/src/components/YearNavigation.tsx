import React from "react";
import { COLORS } from "../constants/colors";

interface YearNavigationProps {
  currentYear: number;
  maxYear: number;
  onYearChange: (year: number) => void;
}

export function YearNavigation({
  currentYear,
  maxYear,
  onYearChange,
}: YearNavigationProps) {
  const isNextDisabled = currentYear >= maxYear;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  };

  const buttonStyle: React.CSSProperties = {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "white",
    border: `1px solid ${COLORS.secondary.s04}`,
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    color: COLORS.secondary.s08,
    transition: "all 0.2s",
  };

  const nextButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    cursor: isNextDisabled ? "not-allowed" : "pointer",
    opacity: isNextDisabled ? 0.5 : 1,
  };

  const yearStyle: React.CSSProperties = {
    fontSize: "36px",
    fontWeight: 700,
    color: COLORS.secondary.s10,
    minWidth: "120px",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle}
        onClick={() => onYearChange(currentYear - 1)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = COLORS.secondary.s02;
          e.currentTarget.style.borderColor = COLORS.secondary.s05;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.borderColor = COLORS.secondary.s04;
        }}
      >
        ←
      </button>
      <div style={yearStyle}>{currentYear}</div>
      <button
        style={nextButtonStyle}
        disabled={isNextDisabled}
        onClick={() => onYearChange(currentYear + 1)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = COLORS.secondary.s02;
          e.currentTarget.style.borderColor = COLORS.secondary.s05;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.borderColor = COLORS.secondary.s04;
        }}
      >
        →
      </button>
    </div>
  );
}

export default YearNavigation;
