import React from 'react';
import { BADGE_STRIP_ITEM_LIMIT } from './schema';
import { AlertCircle } from 'lucide-react';

const BadgeStripForm: React.FC<any> = ({ block }) => {
  const { props } = block;
  const badgeStripProps = props as any; // Type assertion for now
  const itemCount = badgeStripProps.items?.length || 0;
  const isAtLimit = itemCount >= BADGE_STRIP_ITEM_LIMIT;

  return (
    <div className="space-y-4">
      {/* Item Count and Limit Warning */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-800">
              Badges: {itemCount}/{BADGE_STRIP_ITEM_LIMIT}
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
            Maximum of {BADGE_STRIP_ITEM_LIMIT} badges allowed. Remove some badges before adding more.
          </p>
        )}
        {!isAtLimit && (
          <p className="text-xs text-blue-700 mt-1">
            You can add up to {BADGE_STRIP_ITEM_LIMIT - itemCount} more badges.
          </p>
        )}
      </div>
    </div>
  );
};

export default BadgeStripForm;
