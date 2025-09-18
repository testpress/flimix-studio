import React from "react";
import { useMenuSchema } from "@context/MenuSchemaContext";
import { usePageSchema } from "@context/PageSchemaContext";
import { DEFAULT_MENU_STYLE } from "../constants/theme";

const MenuBar: React.FC = () => {
  const { menuSchema } = useMenuSchema();
  const { loadPage, currentPageSlug } = usePageSchema();

  if (!menuSchema?.props?.enabled) {
    return (
      <div className="flex justify-center p-3">
        <div className="px-6 py-2 rounded-full bg-gray-800 border border-gray-600">
          <p className="text-sm text-gray-400">
            Please enable the menu to see navigation options
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-3">
      <div 
        className="px-6 py-2 rounded-full flex items-center"
        style={{
          background: menuSchema.style?.backgroundColor ?? DEFAULT_MENU_STYLE.backgroundColor,
          color: menuSchema.style?.textColor ?? DEFAULT_MENU_STYLE.textColor,
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        {menuSchema.props.items.map((item) => (
          <button
            key={item.id}
            onClick={() => item.slug && loadPage(item.slug)}
            className={`mx-3 text-sm transition-all duration-200 ${
              item.slug === currentPageSlug 
                ? 'text-white font-medium' 
                : 'text-gray-300 hover:text-white'
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
