import React, { useState } from "react";
import { COLORS } from "../constants/colors";
import { AppPage } from "../types";

interface SidebarProps {
  onNavigate?: (page: AppPage) => void;
  currentPage?: AppPage;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onNavigate,
  currentPage = "history",
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [hoveredPage, setHoveredPage] = useState<AppPage | null>(null);

  const sidebarStyle: React.CSSProperties = {
    width: isCollapsed ? "80px" : "360px",
    height: "100vh",
    background: `linear-gradient(180deg, ${COLORS.primary.p01} 0%, ${COLORS.primary.p02} 100%)`,
    display: "flex",
    flexDirection: "column",
    borderRight: `1px solid ${COLORS.secondary.s04}`,
    position: "fixed",
    left: 0,
    top: 0,
    transition: "width 0.1s ease",
  };

  const headerStyle: React.CSSProperties = {
    padding: "24px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${COLORS.secondary.s04}`,
  };

  const logoStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  };

  const logoIconStyle: React.CSSProperties = {
    width: "48px",
    height: "48px",
    background: COLORS.primary.p07,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
    color: "white",
  };

  const logoTextStyle: React.CSSProperties = {
    display: isCollapsed ? "none" : "flex",
    flexDirection: "column",
  };

  const logoTitleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: 700,
    color: COLORS.primary.p09,
    lineHeight: 1.2,
  };

  const toggleButtonStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",

    transition: "background 0.2s",
    marginLeft: "16px",
  };

  const navStyle: React.CSSProperties = {
    flex: 1,
    padding: "16px 0",
  };

  const getNavItemStyle = (page: AppPage): React.CSSProperties => ({
    width: "100%",
    padding: isCollapsed ? "16px" : "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: isCollapsed ? "center" : "flex-start",
    gap: "16px",
    background:
      currentPage === page
        ? COLORS.primary.p03
        : hoveredPage === page
          ? COLORS.primary.p02
          : "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: 500,
    color: COLORS.primary.p09,
    textAlign: "left",
    transition: "background 0.2s",
  });

  const navTextStyle: React.CSSProperties = {
    display: isCollapsed ? "none" : "inline",
  };

  return (
    <aside style={sidebarStyle}>
      <div style={headerStyle}>
        <div style={logoStyle}>
          <span style={logoIconStyle}>$</span>
          <div style={logoTextStyle}>
            <div style={logoTitleStyle}>Expense Tracker</div>
          </div>
        </div>
        <button
          type="button"
          style={toggleButtonStyle}
          aria-label="Toggle sidebar"
          onClick={onToggleCollapse}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#464343"
            strokeWidth="2"
            style={{
              transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <nav style={navStyle}>
        <button
          type="button"
          style={getNavItemStyle("history")}
          onClick={() => onNavigate?.("history")}
          onMouseEnter={() => setHoveredPage("history")}
          onMouseLeave={() => setHoveredPage(null)}
          onFocus={() => setHoveredPage("history")}
          onBlur={() => setHoveredPage(null)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span style={navTextStyle}>History</span>
        </button>
        <button
          type="button"
          style={getNavItemStyle("categories")}
          onClick={() => onNavigate?.("categories")}
          onMouseEnter={() => setHoveredPage("categories")}
          onMouseLeave={() => setHoveredPage(null)}
          onFocus={() => setHoveredPage("categories")}
          onBlur={() => setHoveredPage(null)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <span style={navTextStyle}>Categories</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
