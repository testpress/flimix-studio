import React from 'react';
import { Layout, Type, Square } from 'lucide-react';
import { getAllBlockTemplates } from '../schema/blockTemplates';

interface DragOverlayContentProps {
  activeId: string | null;
}

const DragOverlayContent: React.FC<DragOverlayContentProps> = ({ activeId }) => {
  if (!activeId) {
    return null;
  }

  // Extract block type from activeId (format: "block-template-{type}")
  const blockType = activeId.replace('block-template-', '');
  const templates = getAllBlockTemplates();
  const template = templates.find(t => t.type === blockType);

  if (!template) {
    return null;
  }

  const iconMap = { Layout, Type, Square };
  const IconComponent = iconMap[template.icon as keyof typeof iconMap] || Layout;

  return (
    <div className="w-64 p-4 bg-white border border-gray-200 rounded-lg shadow-lg opacity-90">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${template.color}`}>
          <IconComponent size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {template.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DragOverlayContent; 