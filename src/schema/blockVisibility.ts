// User's current viewing conditions (current user's state)
export interface VisibilityContext {
  isLoggedIn?: boolean;
  isSubscribed?: boolean;
  subscriptionTier?: string;
  region?: string;
  platform?: 'tv' | 'mobile' | 'desktop';
} 