import type { VisibilityProps, Platform } from '@blocks/shared/Visibility';
import type { VisibilityContext } from '@blocks/shared/Visibility';

export function evaluateVisibility(
  visibility?: VisibilityProps,
  context?: VisibilityContext
): boolean {
  if (!visibility) return true;
  if (!context) return false;

  if (
    visibility.isLoggedIn !== undefined &&
    visibility.isLoggedIn !== context.isLoggedIn
  )
    return false;

  if (
    visibility.isSubscribed !== undefined &&
    visibility.isSubscribed !== context.isSubscribed
  )
    return false;

  if (
    visibility.subscriptionTier &&
    visibility.subscriptionTier !== context.subscriptionTier
  )
    return false;

  if (
    visibility.region &&
    !visibility.region.includes(context.region ?? '')
  )
    return false;

  if (
    visibility.platform &&
    context.platform &&
    !visibility.platform.includes(context.platform as Platform)
  )
    return false;

  return true;
} 