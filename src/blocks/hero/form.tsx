import React, { useState } from 'react';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { HeroBlock, HeroMetadata, HeroBadge, HeroCTABtn } from './schema';
import { generateUniqueId } from '@utils/id';
import ContentTab from './form-components/ContentTab';
import MetadataTab from './form-components/MetadataTab';
import BadgesTab from './form-components/BadgesTab';
import CTAsTab from './form-components/CTAsTab';
import CarouselControls from './form-components/CarouselControls';

const HeroForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  const heroBlock = block as HeroBlock;
  const [activeTab, setActiveTab] = useState('content');
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  
  // Get the current hero item
  const currentItem = heroBlock.props.items?.[currentItemIndex] || {
    id: generateUniqueId(),
    title: '',
    subtitle: '',
    backgroundImage: ''
  };
  
  // Helper function to create a default hero item
  const createDefaultHeroItem = () => ({
    id: generateUniqueId(),
    title: '',
    subtitle: '',
    backgroundImage: ''
  });

  // Specific update functions for better type safety and maintainability
  const updateHeroItemTitle = (title: string) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].title = title;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemSubtitle = (subtitle: string) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].subtitle = subtitle;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemBackgroundImage = (backgroundImage: string) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].backgroundImage = backgroundImage;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemVideoBackground = (videoBackground: string) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].videoBackground = videoBackground;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemMetadata = (metadata: HeroMetadata) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].metadata = metadata;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemBadges = (badges: HeroBadge[]) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].badges = badges;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemPrimaryCTA = (primaryCTA: HeroCTABtn) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].primaryCTA = primaryCTA;
    updateProps({ ...heroBlock.props, items: newItems });
  };

  const updateHeroItemSecondaryCTA = (secondaryCTA: HeroCTABtn | undefined) => {
    const newItems = [...(heroBlock.props.items || [])];
    if (!newItems[currentItemIndex]) {
      newItems[currentItemIndex] = createDefaultHeroItem();
    }
    
    newItems[currentItemIndex].secondaryCTA = secondaryCTA;
    updateProps({ ...heroBlock.props, items: newItems });
  };
  
  return (
    <div>
      {/* Tabs navigation */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'metadata' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('metadata')}
        >
          Metadata
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'badges' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('badges')}
        >
          Badges
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'ctas' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('ctas')}
        >
          CTAs
        </button>
      </div>
      
      {/* Carousel Controls */}
      <CarouselControls
        heroBlock={heroBlock}
        currentItemIndex={currentItemIndex}
        setCurrentItemIndex={setCurrentItemIndex}
        updateProps={updateProps}
      />
      
      {/* Tab Content */}
      {activeTab === 'content' && (
        <ContentTab
          heroBlock={heroBlock}
          currentItem={currentItem}
          updateProps={updateProps}
          updateHeroItemTitle={updateHeroItemTitle}
          updateHeroItemSubtitle={updateHeroItemSubtitle}
          updateHeroItemBackgroundImage={updateHeroItemBackgroundImage}
          updateHeroItemVideoBackground={updateHeroItemVideoBackground}
        />
      )}
      
      {activeTab === 'metadata' && (
        <MetadataTab
          currentItem={currentItem}
          updateHeroItemMetadata={updateHeroItemMetadata}
        />
      )}
      
      {activeTab === 'badges' && (
        <BadgesTab
          currentItem={currentItem}
          updateHeroItemBadges={updateHeroItemBadges}
        />
      )}
      
      {activeTab === 'ctas' && (
        <CTAsTab
          currentItem={currentItem}
          updateHeroItemPrimaryCTA={updateHeroItemPrimaryCTA}
          updateHeroItemSecondaryCTA={updateHeroItemSecondaryCTA}
        />
      )}
    </div>
  );
};

export default HeroForm;