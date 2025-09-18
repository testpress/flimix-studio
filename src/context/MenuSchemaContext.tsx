import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { StyleProps } from '@blocks/shared/Style';
import type { VisibilityProps } from '@blocks/shared/Visibility';

export interface MenuItem {
  id: string;
  label: string;
  slug?: string;
  children?: MenuItem[];
  visibility?: VisibilityProps;
}

export interface MenuSchema {
  type: "menu";
  props: {
    enabled: boolean;
    items: MenuItem[];
    alignment?: "left" | "center" | "right";
    variant?: "horizontal" | "vertical";
  };
  style?: StyleProps;
}

interface MenuSchemaContextType {
  menuSchema: MenuSchema;
  updateMenuSchema: (updater: (schema: MenuSchema) => MenuSchema) => void;
}

const MenuSchemaContext = createContext<MenuSchemaContextType | undefined>(undefined);

interface MenuSchemaProviderProps {
  children: ReactNode;
  initialSchema: MenuSchema;
}

export const MenuSchemaProvider: React.FC<MenuSchemaProviderProps> = ({ 
  children, 
  initialSchema 
}) => {
  const [menuSchema, setMenuSchema] = useState<MenuSchema>(initialSchema);

  const updateMenuSchema = (updater: (schema: MenuSchema) => MenuSchema) => {
    setMenuSchema((prev) => updater(prev));
  };

  return (
    <MenuSchemaContext.Provider value={{ menuSchema, updateMenuSchema }}>
      {children}
    </MenuSchemaContext.Provider>
  );
};

export const useMenuSchema = (): MenuSchemaContextType => {
  const context = useContext(MenuSchemaContext);
  if (context === undefined) {
    throw new Error('useMenuSchema must be used within a MenuSchemaProvider');
  }
  return context;
};