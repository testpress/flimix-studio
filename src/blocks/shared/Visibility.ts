// Platform types for visibility
export type Platform = 'tv' | 'mobile' | 'desktop';

// Enhanced visibility configuration
export interface VisibilityProps {
  isLoggedIn?: boolean;
  isSubscribed?: boolean;
  subscriptionTier?: string;
  region?: string[];
  platform?: Platform[];
}

// User's current viewing conditions (current user's state)
export interface VisibilityContext {
  isLoggedIn?: boolean;
  isSubscribed?: boolean;
  subscriptionTier?: string;
  region?: string;
  platform?: Platform;
} 