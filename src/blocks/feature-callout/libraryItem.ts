import type { FeatureCalloutBlockProps } from './schema';

// Feature Callout block template for library
export const FeatureCalloutLibraryItem = {
  type: 'featureCallout' as const,
  name: 'Feature Callout',
  description: 'Highlight platform benefits and unique selling points with icons and labels',
  icon: 'Sparkles' as const,
  defaultProps: {
    title: 'Why Choose Flimix?',
    subtitle: 'Discover what makes us different',
    items: [
      { 
        id: '1', 
        icon: 'Film', 
        label: 'Ultra HD Quality', 
        description: 'Crystal clear streaming',
        style: {
          backgroundColor: '#1f2937',
          textColor: '#ffffff',
          margin: 'sm',
          borderRadius: 'md',
        }
      },
      { 
        id: '2', 
        icon: 'Smartphone', 
        label: 'Watch Anywhere', 
        description: 'Mobile, desktop, and TV',
        style: {
          backgroundColor: '#1f2937',
          textColor: '#ffffff',
          margin: 'sm',
          borderRadius: 'md',
        }
      },
      { 
        id: '3', 
        icon: 'Zap', 
        label: 'Lightning Fast', 
        description: 'No buffering, instant play',
        style: {
          backgroundColor: '#1f2937',
          textColor: '#ffffff',
          margin: 'sm',
          borderRadius: 'md',
        }
      }
    ],
    itemSize: 'medium' as const,
    showIcons: true,
    showDescriptions: true
  } as FeatureCalloutBlockProps
};  