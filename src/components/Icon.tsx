import React from 'react';
import { 
  Clapperboard, Film, Video, Play, Star, Heart, Zap, Rocket,
  Shield, CheckCircle, Award, Gift, Lightbulb, Target, TrendingUp,
  Users, Globe, Smartphone, Monitor, Tv, Headphones, Music,
  Camera, Image, FileText, BookOpen, GraduationCap, Briefcase,
  Home, MapPin, Phone, Mail, MessageCircle, ThumbsUp, Smile, Radio,Search,Bell,Box,DollarSign,CircleQuestionMark
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
}

// Icon mapping for Feature Callout
const iconMap: Record<string, LucideIcon> = {
  Clapperboard, Film, Video, Play, Star, Heart, Zap, Rocket,
  Shield, CheckCircle, Award, Gift, Lightbulb, Target, TrendingUp,
  Users, Globe, Smartphone, Monitor, Tv, Headphones, Music,
  Camera, Image, FileText, BookOpen, GraduationCap, Briefcase,
  Home, MapPin, Phone, Mail, MessageCircle, ThumbsUp, Smile, Radio,Search,Bell,Box,DollarSign,CircleQuestionMark
};

export const iconNames = Object.keys(iconMap);

const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  className = '', 
  fallback = null 
}) => {
  // Try to get the icon from our icon map
  const IconComponent = iconMap[name];
  
  if (IconComponent) {
    return <IconComponent size={size} className={className} />;
  }
  
  // Return fallback if icon not found
  return fallback || <span className={`text-current ${className}`}>{name}</span>;
};

export default Icon; 