export interface RenderContext {
  isLoggedIn?: boolean;
  isSubscribed?: boolean;
  subscriptionTier?: string;
  region?: string;
  platform?: 'tv' | 'mobile' | 'desktop';
} 