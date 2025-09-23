import React, { createContext, useState, useContext } from 'react';
import type { StyleProps } from '@blocks/shared/Style';

export interface MenuItem {
  id: string;
  label: string;
  type: "internal" | "external" | "anchor"; 
  slug?: string;
  url?: string;
  anchor?: string;
  icon?: string;
  children?: MenuItem[];
}

export interface Menu {
  props: {
    enabled: boolean;
    alignment: "left" | "center" | "right";
    items: MenuItem[];
  };
  style: StyleProps & {
    hoverColor?: string;
  };
}

export interface MenuInitialData {
  [location: string]: Menu;
}

interface MenuContextType {
  menus: { [location: string]: Menu };
  menuSlug?: string;
  defaultLocation?: string;
  setMenu: (location: string, schema: Menu) => void;
}

const MenuSchemaContext = createContext<MenuContextType | null>(null);

export const useMenuSchema = () => {
  const context = useContext(MenuSchemaContext);
  if (!context) {
    throw new Error("useMenuSchema must be used within a MenuSchemaProvider");
  }
  return context;
};

export const MenuSchemaProvider: React.FC<{ 
  initialMenu?: MenuInitialData; 
  menuSlug?: string;
  defaultLocation?: string;
  children: React.ReactNode;
}> = ({ children, initialMenu, menuSlug, defaultLocation }) => {
  const [menus, setMenus] = useState<{ [location: string]: Menu }>(initialMenu || {});

  const setMenu = (location: string, schema: Menu) => {
    setMenus(prev => ({
      ...prev,
      [location]: schema
    }));
  };

  return (
    <MenuSchemaContext.Provider value={{ menus, setMenu, menuSlug, defaultLocation }}>
      {children}
    </MenuSchemaContext.Provider>
  );
};

