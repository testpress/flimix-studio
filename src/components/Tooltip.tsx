import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: ReactNode;
  children: React.ReactElement;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState<'left' | 'right' | 'top' | 'bottom'>('left');
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !isVisible) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Default dimensions (approximate, or we could measure the tooltip ref)
    const tooltipWidth = 250;
    const tooltipHeight = 120;
    const gap = 10;

    let top = rect.top;
    let left = rect.right + gap;
    let newArrowPos: 'left' | 'right' | 'top' | 'bottom' = 'left';

    // Check right edge
    if (left + tooltipWidth > windowWidth) {
      left = rect.left - tooltipWidth - gap;
      newArrowPos = 'right';
    }

    // Check bottom edge
    if (top + tooltipHeight > windowHeight) {
      top = rect.bottom - tooltipHeight;
      // If it's still offscreen, push it up
      if (top + tooltipHeight > windowHeight) {
        top = windowHeight - tooltipHeight - gap;
      }
    }

    // Simple vertical centering fallback if needed, but keeping close to original logic for now
    
    setPosition({ top, left });
    setArrowPosition(newArrowPos);
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible, updatePosition]);

  return (
    <>
      <div 
        ref={triggerRef}
        className={className}
        onMouseEnter={() => {
          updatePosition();
          setIsVisible(true);
        }}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && createPortal(
        <div 
          className="fixed z-[9999] bg-white border border-gray-200 rounded-lg p-4 shadow-lg transition-opacity duration-200"
          style={{
            width: '250px',
            top: position.top,
            left: position.left,
            maxWidth: '300px',
            maxHeight: '200px',
            overflow: 'auto'
          }}
        >
          {content}
          
          {/* Arrow */}
          {arrowPosition === 'left' && (
            <div className="absolute top-4 left-0 transform -translate-x-1/2 rotate-45 w-3 h-3 bg-white border-l border-b border-gray-200"></div>
          )}
          {arrowPosition === 'right' && (
            <div className="absolute top-4 right-0 transform translate-x-1/2 rotate-45 w-3 h-3 bg-white border-t border-r border-gray-200"></div>
          )}
        </div>,
        document.body
      )}
    </>
  );
};
