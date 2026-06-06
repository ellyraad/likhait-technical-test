import React, { useState } from "react";
import { COLORS } from "../constants/colors";

type NavigationDirection = "previous" | "next";

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
  const [hoveredDirection, setHoveredDirection] =
    useState<NavigationDirection | null>(null);
  const isNextDisabled = currentYear >= maxYear;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  };

  const getButtonStyle = (
    direction: NavigationDirection,
    disabled = false,
  ): React.CSSProperties => ({
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      !disabled && hoveredDirection === direction ? COLORS.secondary.s02 : "white",
    border: `1px solid ${
      !disabled && hoveredDirection === direction
        ? COLORS.secondary.s05
        : COLORS.secondary.s04
    }`,
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "18px",
    color: COLORS.secondary.s08,
    transition: "all 0.2s",
    opacity: disabled ? 0.5 : 1,
  });

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
        style={getButtonStyle("previous")}
        onClick={() => onYearChange(currentYear - 1)}
        onMouseEnter={() => setHoveredDirection("previous")}
        onMouseLeave={() => setHoveredDirection(null)}
      >
        ←
      </button>
      <div style={yearStyle}>{currentYear}</div>
      <button
        style={getButtonStyle("next", isNextDisabled)}
        disabled={isNextDisabled}
        onClick={() => onYearChange(currentYear + 1)}
        onMouseEnter={() => setHoveredDirection("next")}
        onMouseLeave={() => setHoveredDirection(null)}
      >
        →
      </button>
    </div>
  );
}

export default YearNavigation;
