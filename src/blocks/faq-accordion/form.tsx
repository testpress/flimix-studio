import React from 'react';
import PropertiesForm from '@blocks/settings/PropertiesForm';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { Field } from '@blocks/shared/Field';
import { FAQ_ACCORDION_ITEM_LIMIT } from './schema';
import { AlertCircle } from 'lucide-react';

// FAQ Accordion block editor schema - only basic properties
const faqAccordionEditorFields: Field[] = [
  { 
    key: 'title', 
    label: 'FAQ Title', 
    type: 'text',
    placeholder: 'Enter FAQ title (e.g., "Frequently Asked Questions", "Common Questions")...'
  }
];

const FAQAccordionForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  // Get current item count
  const itemCount = (block.props as any)?.items?.length || 0;
  const isAtLimit = itemCount >= FAQ_ACCORDION_ITEM_LIMIT;

  return (
    <div className="space-y-6">
      {/* Properties Form for block properties */}
      <PropertiesForm
        block={block}
        updateProps={updateProps}
        fieldDefinitions={faqAccordionEditorFields}
      />

      {/* Item Count and Limit Warning */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-800">
              Items: {itemCount}/{FAQ_ACCORDION_ITEM_LIMIT}
            </span>
          </div>
          {isAtLimit && (
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-xs text-yellow-700 font-medium">Limit Reached</span>
            </div>
          )}
        </div>
        {isAtLimit && (
          <p className="text-xs text-yellow-700 mt-1">
            Maximum of {FAQ_ACCORDION_ITEM_LIMIT} items allowed. Remove some items before adding more.
          </p>
        )}
      </div>
    </div>
  );
};

export default FAQAccordionForm; 