import React from "react";
import { useMenuSchema } from "@context/MenuSchemaContext";
import type { Padding, BorderRadius } from "@blocks/shared/Style";

interface Props {
  pagesList: string[];
}

const MenuSettingsForm: React.FC<Props> = ({ pagesList }) => {
  const { menuSchema, updateMenuSchema } = useMenuSchema();

  const toggleEnabled = () => {
    updateMenuSchema((prev) => ({
      ...prev,
      props: { ...prev.props, enabled: !prev.props.enabled },
    }));
  };

  const updateItem = (id: string, changes: Partial<{ label: string; slug: string }>) => {
    updateMenuSchema((prev) => {
      const newItems = prev.props.items.map((item) =>
        item.id === id ? { ...item, ...changes } : item
      );
      return { ...prev, props: { ...prev.props, items: newItems } };
    });
  };

  // Function to update menu style
  const updateMenuStyle = (property: string, value: string) => {
    updateMenuSchema((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        [property]: value,
      },
    }));
  };

  // Function to update menu alignment
  const updateAlignment = (alignment: "left" | "center" | "right") => {
    updateMenuSchema((prev) => ({
      ...prev,
      props: {
        ...prev.props,
        alignment,
      },
    }));
  };

  // Collect used slugs for uniqueness
  const usedSlugs = menuSchema.props.items
    .map((i) => i.slug)
    .filter(Boolean) as string[];

  // Style options
  const paddingOptions: { value: Padding; label: string }[] = [
    { value: "none", label: "None" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
  ];

  const borderRadiusOptions: { value: BorderRadius; label: string }[] = [
    { value: "none", label: "None" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
  ];


  return (
    <>
      {/* Menu Info Section */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">Menu Information</h3>
        <div className="text-sm">
          <p className="text-gray-700">
            <span className="font-medium">Type:</span> Navigation Menu
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Items:</span> {menuSchema.props.items.length}
          </p>
        </div>
      </div>

      {/* Menu Properties Section */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">Menu Properties</h3>
        
        {/* Enabled Toggle */}
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={menuSchema.props.enabled}
              onChange={toggleEnabled}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enable Menu</span>
          </label>
        </div>

        {/* Menu Alignment */}
        <div className="mb-4">
          <label className="block mb-1 text-xs font-medium text-gray-700">
            Alignment
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                checked={menuSchema.props.alignment === "left"}
                onChange={() => updateAlignment("left")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Left</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                checked={menuSchema.props.alignment === "center"}
                onChange={() => updateAlignment("center")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Center</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                checked={menuSchema.props.alignment === "right"}
                onChange={() => updateAlignment("right")}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Right</span>
            </label>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Menu Items</h4>
          {menuSchema.props.items.map((item) => {
            const isLeaf = !item.children || item.children.length === 0;

            return (
              <div key={item.id} className="border p-3 rounded bg-white shadow-sm">
                {/* Label Input */}
                <div className="mb-3">
                  <label className="block mb-1 text-xs font-medium text-gray-700">
                    Label
                  </label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateItem(item.id, { label: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Slug Dropdown → only for leaf items */}
                {isLeaf ? (
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-700">
                      Page
                    </label>
                    <select
                      value={item.slug || ""}
                      onChange={(e) => updateItem(item.id, { slug: e.target.value })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="" disabled>
                        -- Select Page --
                      </option>
                      {pagesList.map((slug) => (
                        <option
                          key={slug}
                          value={slug}
                          disabled={usedSlugs.includes(slug) && slug !== item.slug}
                        >
                          {slug}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    This item has children and cannot be linked to a page.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu Style Section */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">Menu Style</h3>
        
        {/* Colors */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          {/* Background Color */}
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={menuSchema.style?.backgroundColor || "#1f2937"}
                onChange={(e) => updateMenuStyle("backgroundColor", e.target.value)}
                className="w-8 h-8 p-0 border-0 rounded"
              />
              <input
                type="text"
                value={menuSchema.style?.backgroundColor || "#1f2937"}
                onChange={(e) => updateMenuStyle("backgroundColor", e.target.value)}
                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Text Color */}
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={menuSchema.style?.textColor || "#ffffff"}
                onChange={(e) => updateMenuStyle("textColor", e.target.value)}
                className="w-8 h-8 p-0 border-0 rounded"
              />
              <input
                type="text"
                value={menuSchema.style?.textColor || "#ffffff"}
                onChange={(e) => updateMenuStyle("textColor", e.target.value)}
                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Hover Color */}
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Hover Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={menuSchema.style?.hoverColor || "#3b82f6"}
                onChange={(e) => updateMenuStyle("hoverColor", e.target.value)}
                className="w-8 h-8 p-0 border-0 rounded"
              />
              <input
                type="text"
                value={menuSchema.style?.hoverColor || "#3b82f6"}
                onChange={(e) => updateMenuStyle("hoverColor", e.target.value)}
                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Spacing */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Padding */}
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Padding
            </label>
            <select
              value={menuSchema.style?.padding || "md"}
              onChange={(e) => updateMenuStyle("padding", e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              {paddingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Margin */}
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Margin
            </label>
            <select
              value={menuSchema.style?.margin || "none"}
              onChange={(e) => updateMenuStyle("margin", e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              {paddingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Border Radius */}
        <div className="mb-4">
          <label className="block mb-1 text-xs font-medium text-gray-700">
            Border Radius
          </label>
          <select
            value={menuSchema.style?.borderRadius || "lg"}
            onChange={(e) => updateMenuStyle("borderRadius", e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            {borderRadiusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

      </div>
    </>
  );
};

export default MenuSettingsForm;
