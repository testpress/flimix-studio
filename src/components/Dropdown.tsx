import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={handleTriggerClick}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-md shadow-lg border border-neutral-700 z-[9999]">
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ 
  children, 
  onClick, 
  className = '' 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900 focus:bg-neutral-900 focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
};

export default Dropdown; 