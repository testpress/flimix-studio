import React from 'react';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

// Create context outside of component to avoid recreation
const TabsContext = React.createContext<{
  selectedTab: string;
  handleTabChange: (value: string) => void;
}>({
  selectedTab: '',
  handleTabChange: () => {}
});

export const Tabs: React.FC<TabsProps> = ({ 
  defaultValue, 
  value, 
  onValueChange,
  className = '',
  children 
}) => {
  const [selectedTab, setSelectedTab] = React.useState<string>(value || defaultValue || '');
  
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedTab(value);
    }
  }, [value]);
  
  const handleTabChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setSelectedTab(newValue);
    }
  };
  
  return (
    <TabsContext.Provider value={{ selectedTab, handleTabChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabBarProps {
  className?: string;
  children: React.ReactNode;
}

export const TabBar: React.FC<TabBarProps> = ({ className = '', children }) => {
  return (
    <div className={`flex bg-gray-900 rounded-lg p-1 ${className}`}>
      {children}
    </div>
  );
};

interface TabButtonProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabButton: React.FC<TabButtonProps> = ({ value, className = '', children }) => {
  const { selectedTab, handleTabChange } = React.useContext(TabsContext);
  const isSelected = selectedTab === value;
  
  return (
    <button
      onClick={() => handleTabChange(value)}
      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors
        ${isSelected 
          ? 'bg-gray-700 text-white' 
          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
        } ${className}`}
    >
      {children}
    </button>
  );
};

interface TabPanelProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ value, className = '', children }) => {
  const { selectedTab } = React.useContext(TabsContext);
  
  if (selectedTab !== value) {
    return null;
  }
  
  return (
    <div className={className}>
      {children}
    </div>
  );
};