import React from 'react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaButton?: {
    label: string;
    link: string;
  };
}

interface HeroStyle {
  theme?: string;
  padding?: string;
  textColor?: string;
}

interface HeroBlockProps {
  props: HeroProps;
  style?: HeroStyle;
}

const HeroBlock: React.FC<HeroBlockProps> = ({ props, style }) => {
  const { title, subtitle, backgroundImage, ctaButton } = props;
  const isDark = style?.theme === 'dark';
  const paddingClass = style?.padding === 'lg' ? 'p-12' : 'p-8';
  const textColor = style?.textColor || (isDark ? 'text-white' : 'text-gray-900');

  return (
    <div 
      className={`relative rounded-lg overflow-hidden ${paddingClass} ${
        isDark ? 'bg-gray-900' : 'bg-gray-100'
      }`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for better text readability */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {title && (
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${textColor}`}>
            {title}
          </h1>
        )}
        
        {subtitle && (
          <p className={`text-xl md:text-2xl mb-8 ${textColor} opacity-90`}>
            {subtitle}
          </p>
        )}
        
        {ctaButton && (
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
            {ctaButton.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default HeroBlock; 