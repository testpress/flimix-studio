import React, { createContext, useContext, useMemo } from 'react';
import type { BlockType } from '../types/block';
import { getAvailableBlockTypes } from '../types/library';

interface BuilderConfig {
  allowedBlocks?: BlockType['type'][];
  restrictedBlocks?: BlockType['type'][];
  maxBlockCount?: number;
}

interface BuilderConfigContextValue {
  config: BuilderConfig;
  isBlockAllowed: (blockType: BlockType['type']) => boolean;
  canAddMoreBlocks: (currentCount: number) => boolean;
  getFilteredBlocks: <T extends { type: BlockType['type'] }>(blocks: T[]) => T[];
}

const BuilderConfigContext = createContext<BuilderConfigContextValue | undefined>(undefined);

// Validate and sanitize config on initialization
const sanitizeConfig = (config?: BuilderConfig): BuilderConfig => {
  if (!config) return {};

  const allValidTypes = getAvailableBlockTypes();
  const result: BuilderConfig = {};

  // Helper to filter valid blocks
  const filterValidBlocks = (blocks: BlockType['type'][], contextName: string) => {
    return blocks.filter((type) => {
      const isValid = allValidTypes.includes(type);
      if (!isValid) {
        console.warn(`[BuilderConfig] Invalid block type in ${contextName}: "${type}". Ignoring.`);
      }
      return isValid;
    });
  };

  if (config.allowedBlocks) {
    const validAllowed = filterValidBlocks(config.allowedBlocks, 'allowedBlocks');
    result.allowedBlocks = validAllowed;

    if (config.allowedBlocks.length > 0 && validAllowed.length === 0) {
      console.warn('[BuilderConfig] `allowedBlocks` contained only invalid types, so no blocks will be allowed.');
    }
  }

  // Validate and filter restrictedBlocks (only if allowedBlocks not set)
  if (config.restrictedBlocks && !result.allowedBlocks) {
    const validRestricted = filterValidBlocks(config.restrictedBlocks, 'restrictedBlocks');

    if (validRestricted.length > 0) {
      result.restrictedBlocks = validRestricted;
    }
  } else if (config.restrictedBlocks && result.allowedBlocks) {
    console.info('[BuilderConfig] Both allowedBlocks and restrictedBlocks provided. Using allowedBlocks only.');
  }

  // Validate maxBlockCount
  if (config.maxBlockCount !== undefined) {
    if (typeof config.maxBlockCount === 'number' && config.maxBlockCount > 0) {
      result.maxBlockCount = config.maxBlockCount;
    } else {
      console.warn('[BuilderConfig] Invalid maxBlockCount. Must be positive number. Ignoring.');
    }
  }

  return result;
};


export const BuilderConfigProvider: React.FC<{
  config?: BuilderConfig;
  children: React.ReactNode;
}> = ({ config, children }) => {
  const sanitizedConfig = useMemo(() => sanitizeConfig(config), [config]);

  const isBlockAllowed = (blockType: BlockType['type']): boolean => {
    // If allowedBlocks is set, use whitelist
    if (sanitizedConfig.allowedBlocks) {
      return sanitizedConfig.allowedBlocks.includes(blockType);
    }

    // If restrictedBlocks is set, use blacklist
    if (sanitizedConfig.restrictedBlocks) {
      return !sanitizedConfig.restrictedBlocks.includes(blockType);
    }

    // No restrictions
    return true;
  };

  const canAddMoreBlocks = (currentCount: number): boolean => {
    if (sanitizedConfig.maxBlockCount === undefined) return true;
    return currentCount < sanitizedConfig.maxBlockCount;
  };

  const getFilteredBlocks = <T extends { type: BlockType['type'] }>(blocks: T[]): T[] => {
    return blocks.filter((block) => isBlockAllowed(block.type));
  };

  const value: BuilderConfigContextValue = {
    config: sanitizedConfig,
    isBlockAllowed,
    canAddMoreBlocks,
    getFilteredBlocks,
  };

  return <BuilderConfigContext.Provider value={value}>{children}</BuilderConfigContext.Provider>;
};

export const useBuilderConfig = (): BuilderConfigContextValue => {
  const context = useContext(BuilderConfigContext);
  if (!context) {
    throw new Error('useBuilderConfig must be used within a BuilderConfigProvider');
  }
  return context;
};
