import React from "react";
import { useMenuSchema } from "@context/MenuSchemaContext";
import { usePageSchema } from "@context/PageSchemaContext";
import { useSelection } from "@context/SelectionContext";
import { DEFAULT_MENU_STYLE } from "../constants/theme";

const MenuBar: React.FC = () => {
  const { menuSchema } = useMenuSchema();
  const { loadPage, currentPageSlug } = usePageSchema();
  const { selection, select } = useSelection();

  const isSelected = selection?.type === "menu";

  // Get alignment class
  const getAlignmentClass = () => {
    switch (menuSchema.props.alignment) {
      case "left":
        return "justify-start";
      case "right":
        return "justify-end";
      case "center":
      default:
        return "justify-center";
    }
  };

  // Get margin class (space outside the menu)
  const getMarginClass = () => {
    switch (menuSchema.style?.margin) {
      case "none":
        return "m-0";
      case "sm":
        return "m-2";
      case "md":
        return "m-3";
      case "lg":
        return "m-4";
      default:
        return "m-2"; // Default margin
    }
  };

  // Get padding class (space inside the menu)
  const getPaddingClass = () => {
    switch (menuSchema.style?.padding) {
      case "none":
        return "p-0";
      case "sm":
        return "p-2";
      case "md":
        return "p-3";
      case "lg":
        return "p-4";
      default:
        return "p-3"; // Default padding
    }
  };

  // Get border radius class
  const getBorderRadiusClass = () => {
    switch (menuSchema.style?.borderRadius) {
      case "none":
        return "rounded-none";
      case "sm":
        return "rounded-sm";
      case "md":
        return "rounded-md";
      case "lg":
        return "rounded-full";
      default:
        return "rounded-full";
    }
  };


  // Create hover styles for menu items
  const hoverColor = menuSchema.style?.hoverColor ?? "#3b82f6";
  
  // Generate a style tag for hover effects
  const hoverStyle = `
    .menu-item:hover {
      color: ${hoverColor} !important;
    }
  `;

  // Create container styles
  const containerStyle = {
    background: menuSchema.style?.backgroundColor ?? DEFAULT_MENU_STYLE.backgroundColor,
    color: menuSchema.style?.textColor ?? DEFAULT_MENU_STYLE.textColor,
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  if (!menuSchema?.props?.enabled) {
    return (
      <div className={`flex ${getAlignmentClass()} ${getMarginClass()}`}>
        <div 
          className={`${getPaddingClass()} ${getBorderRadiusClass()} bg-gray-800 border border-gray-600 ${
            isSelected ? "ring-2 ring-blue-400" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            select({ type: "menu" });
          }}
        >
          <p className="text-sm text-gray-400">
            Please enable the menu to see navigation options
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${getAlignmentClass()} ${getMarginClass()}`}>
      <style>{hoverStyle}</style>
      <div 
        className={`${getPaddingClass()} flex items-center ${getBorderRadiusClass()} ${
          isSelected ? "ring-2 ring-blue-400" : ""
        }`}
        style={containerStyle}
        onClick={(e) => {
          e.stopPropagation();
          select({ type: "menu" });
        }}
      >
        {menuSchema.props.items.map((item) => (
          <button
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              if (!item.children || item.children.length === 0) {
                item.slug && loadPage(item.slug);
              }
            }}
            className={`menu-item mx-3 text-sm transition-all duration-200 ${
              item.slug === currentPageSlug 
                ? 'text-white font-medium' 
                : 'text-gray-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuBar;
