import { useState, type CSSProperties } from "react";
import { COLORS } from "../constants/colors";
import { getCategoryEmoji } from "../constants/categoryEmojis";
import { Category } from "../types";

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  loadError: string;
  onEditCategory: (category: Category) => void;
}

const categoryListStyle: CSSProperties = {
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  padding: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const categoryIconStyle: CSSProperties = {
  fontSize: "24px",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "white",
  borderRadius: "6px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  flexShrink: 0,
};

const categoryNameStyle: CSSProperties = {
  fontSize: "18px",
  fontWeight: 600,
  color: COLORS.secondary.s10,
};

const statusStyle: CSSProperties = {
  padding: "32px",
  textAlign: "center",
  color: COLORS.secondary.s08,
  fontSize: "16px",
};

const listErrorStyle: CSSProperties = {
  padding: "32px",
  textAlign: "center",
  color: COLORS.danger,
  fontSize: "16px",
};

const getCategoryItemStyle = (
  category: Category,
  isHovered: boolean,
): CSSProperties => ({
  width: "100%",
  padding: "16px 24px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  background: isHovered ? COLORS.secondary.s02 : COLORS.secondary.s01,
  borderRadius: "8px",
  border: "none",
  cursor: category.custom ? "pointer" : "default",
  transition: "all 0.2s",
  textAlign: "left",
  transform: isHovered ? "translateY(-2px)" : "translateY(0)",
  boxShadow: isHovered ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
});

export function CategoryList({
  categories,
  loading,
  loadError,
  onEditCategory,
}: CategoryListProps) {
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(
    null,
  );

  return (
    <main style={categoryListStyle}>
      {loading ? (
        <div style={statusStyle}>Loading...</div>
      ) : loadError ? (
        <div style={listErrorStyle}>{loadError}</div>
      ) : (
        categories.map((category) => {
          const isHovered = hoveredCategoryId === category.id;
          const content = (
            <>
              <span style={categoryIconStyle}>
                {getCategoryEmoji(category.name)}
              </span>
              <span style={categoryNameStyle}>{category.name}</span>
            </>
          );

          return category.custom ? (
            <button
              key={category.id}
              type="button"
              style={getCategoryItemStyle(category, isHovered)}
              onClick={() => onEditCategory(category)}
              onMouseEnter={() => setHoveredCategoryId(category.id)}
              onMouseLeave={() => setHoveredCategoryId(null)}
              onFocus={() => setHoveredCategoryId(category.id)}
              onBlur={() => setHoveredCategoryId(null)}
            >
              {content}
            </button>
          ) : (
            <div key={category.id} style={getCategoryItemStyle(category, false)}>
              {content}
            </div>
          );
        })
      )}
    </main>
  );
}
