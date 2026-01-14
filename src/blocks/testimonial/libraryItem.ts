import type { TestimonialBlockProps } from './schema';
import { generateUniqueId } from '@utils/id';

// Testimonial block template for library
export const TestimonialLibraryItem = {
  type: 'testimonial' as const,
  name: 'Testimonial',
  description: 'Display customer testimonials in carousel or grid layout',
  icon: 'MessageSquare' as const,
  defaultProps: {
    title: 'What Our Viewers Say',
    layout: 'carousel' as const,
    items: [
      {
        id: generateUniqueId(),
        quote: 'Flimix changed how I watch shows. Seamless!',
        name: 'Rhea Kapoor',
        designation: 'Film Enthusiast',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        rating: 5
      },
      {
        id: generateUniqueId(),
        quote: 'Best OTT platform for regional content!',
        name: 'Manoj R.',
        designation: 'Content Creator',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        rating: 4
      },
      {
        id: generateUniqueId(),
        quote: 'Incredible user experience. Highly recommended!',
        name: 'Priya Sharma',
        designation: 'Tech Blogger',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        rating: 5
      }
    ],
    autoplay: true,
    scroll_speed: 1000,
    show_arrows: true,
    item_size: 'large' as const,
    columns: 3 as const,
    rows: 2 as const,
    item_shape: 'circle' as const
  } as TestimonialBlockProps
}; 