import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { useOnClickOutside } from '@hooks/useOnClickOutside';

interface ApiSearchDropdownProps<T> {
  // Search function that returns items of type T
  searchFunction: (params: { query: string; limit: number; offset: number; }, signal?: AbortSignal) => Promise<T[]>;
  renderItem: (item: T, onSelect: (item: T) => void) => React.ReactNode;
  onSelect: (item: T) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  getItemId?: (item: T) => string | number;
  noResultsMessage?: string;
  initialQuery?: string;
  debounceDelay?: number;
}

export function ApiSearchDropdown<T>({
  searchFunction,
  renderItem,
  onSelect,
  placeholder = 'Search...',
  label,
  disabled = false,
  className = '',
  getItemId = (item: any) => item.id,
  noResultsMessage = 'No results found',
  initialQuery = '',
  debounceDelay = 250
}: ApiSearchDropdownProps<T>) {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Debounced query
  const debouncedQuery = useDebouncedValue(query, debounceDelay);
  
  // Handle outside clicks
  useOnClickOutside(dropdownRef, () => setIsOpen(false));
  
  // Fetch items when debounced query changes
  useEffect(() => {
    if (!isOpen) return;
    
    // Reset pagination when query changes
    setCurrentOffset(0);
    setHasMore(true);
    setItems([]); // Clear previous items
    
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        
        const data = await searchFunction({
          query: debouncedQuery,
          limit: 20,
          offset: 0
        }, controller.signal);
        
        setItems(data);
        setHasMore(data.length === 20);
        
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('Failed to fetch results. Please try again.');
          setItems([]);
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    };
    
    fetchItems();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery, isOpen, searchFunction]);
  
  // Handle dropdown scroll for infinite scrolling
  const handleDropdownScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // If scrolled to bottom (with 10px tolerance)
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (!isLoadingMore && hasMore && !loading) {
        setIsLoadingMore(true);
        
        try {
          const nextOffset = currentOffset + 20;
          const data = await searchFunction({
            query: debouncedQuery,
            limit: 20,
            offset: nextOffset
          });
          
          // Append new items
          setItems(prev => [...prev, ...data]);
          setCurrentOffset(nextOffset);
          setHasMore(data.length === 20);
          
        } catch (err) {
          // Ignore errors during load more
        } finally {
          setIsLoadingMore(false);
        }
      }
    }
  };
  
  // Handle item selection
  const handleSelectItem = (item: T) => {
    onSelect(item);
    setIsOpen(false);
    setQuery('');
  };
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={16} />
        </div>
        {query && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <button 
              onClick={() => {
                setQuery('');
                searchInputRef.current?.focus();
              }}
              className="p-1 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      
      {isOpen && (
        <div 
          className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-72 overflow-y-auto"
          onScroll={handleDropdownScroll}
        >
          {loading && items.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-red-500">{error}</div>
          ) : items.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              {debouncedQuery ? noResultsMessage : 'Start typing to search...'}
            </div>
          ) : (
            <>
              <ul className="py-1">
                {items.map((item) => (
                  <li key={getItemId(item)}>
                    {renderItem(item, handleSelectItem)}
                  </li>
                ))}
              </ul>
              
              {/* Loading indicator for more items */}
              {isLoadingMore && (
                <div className="p-3 text-center text-sm text-gray-500 border-t">
                  Loading more...
                </div>
              )}
              
              {/* End of results indicator */}
              {!hasMore && items.length > 0 && (
                <div className="p-3 text-center text-xs text-gray-400 border-t">
                  End of results
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
