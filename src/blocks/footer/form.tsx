import React, { useState } from 'react';
import PropertiesForm from '@blocks/settings/PropertiesForm';
import type { BlockFormProps } from '@blocks/shared/FormTypes';
import type { Field } from '@blocks/shared/Field';
import type { FooterBlock, SocialLink, SocialPlatform } from './schema';
import { SOCIAL_LINKS_LIMIT } from './schema';
import { generateUniqueId } from '@utils/id';
import { Plus, Trash2, Edit3, Share2, AlertCircle, Twitter, Facebook, Instagram, MessageCircle, Linkedin, Youtube, Gamepad2 } from 'lucide-react';

const FooterForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);

  // Type guard to ensure we have a FooterBlock
  if (block.type !== 'footer') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Invalid block type for FooterForm</p>
      </div>
    );
  }

  const footerBlock = block as FooterBlock;
  const socialLinksCount = footerBlock.props.socialLinks?.length || 0;
  const isAtSocialLinksLimit = socialLinksCount >= SOCIAL_LINKS_LIMIT;

  // Available social media platforms with Lucide icons
  const availablePlatforms: { value: SocialPlatform; label: string; icon: React.ReactNode }[] = [
    { value: 'twitter', label: 'Twitter / X', icon: <Twitter className="w-4 h-4" /> },
    { value: 'facebook', label: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
    { value: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
    { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
    { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
    { value: 'youtube', label: 'YouTube', icon: <Youtube className="w-4 h-4" /> },
    { value: 'discord', label: 'Discord', icon: <Gamepad2 className="w-4 h-4" /> }
  ];

  // Basic properties form fields
  const basicFields: Field[] = [
    { key: 'branding', label: 'Branding Text', type: 'text', placeholder: 'Enter branding text...' },
  ];

  // Social links management
  const handleAddSocialLink = () => {
    if (isAtSocialLinksLimit) return;

    const newSocialLink: SocialLink = {
      id: generateUniqueId(),
      platform: 'linkedin',
      url: 'https://www.linkedin.com/company/testpress/posts/?feedView=all'
    };

    const updatedSocialLinks = [...(footerBlock.props.socialLinks || []), newSocialLink];
    updateProps({ socialLinks: updatedSocialLinks });
  };

  const handleDeleteSocialLink = (socialLinkId: string) => {
    const updatedSocialLinks = footerBlock.props.socialLinks?.filter(social => social.id !== socialLinkId) || [];
    updateProps({ socialLinks: updatedSocialLinks });
    
    if (editingSocialLink?.id === socialLinkId) {
      setEditingSocialLink(null);
    }
  };

  const handleEditSocialLink = (socialLink: SocialLink) => {
    setEditingSocialLink({ ...socialLink });
  };

  const handleSaveSocialLink = () => {
    if (!editingSocialLink?.id) return;

    const updatedSocialLinks = footerBlock.props.socialLinks?.map(social => 
      social.id === editingSocialLink.id ? { ...social, ...editingSocialLink } : social
    ) || [];

    updateProps({ socialLinks: updatedSocialLinks });
    setEditingSocialLink(null);
  };

  return (
    <div className="space-y-8">
      {/* Basic Properties */}
        <PropertiesForm
          block={block}
          fieldDefinitions={basicFields}
          updateProps={updateProps}
        />
      {/* Social Links Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
        
        {/* Social Links Count and Limit Warning */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800">
                Social Links: {socialLinksCount}/{SOCIAL_LINKS_LIMIT}
              </span>
            </div>
            {isAtSocialLinksLimit && (
              <div className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-yellow-700 font-medium">Limit Reached</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleAddSocialLink}
            disabled={isAtSocialLinksLimit}
            className={`inline-flex items-center px-4 py-2 text-sm rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors font-medium ${
              isAtSocialLinksLimit
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
          </button>
        </div>

        <div className="space-y-4">
          {footerBlock.props.socialLinks && footerBlock.props.socialLinks.length > 0 ? (
            footerBlock.props.socialLinks.map((socialLink) => (
              <div key={socialLink.id} className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                {editingSocialLink?.id === socialLink.id ? (
                  // Edit social link mode
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Platform
                        </label>
                        <select
                          value={editingSocialLink.platform}
                          onChange={(e) => setEditingSocialLink({ ...editingSocialLink, platform: e.target.value as SocialPlatform })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          {availablePlatforms.map((platform) => (
                            <option key={platform.value} value={platform.value}>
                              {platform.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile URL
                        </label>
                        <input
                          type="text"
                          value={editingSocialLink.url}
                          onChange={(e) => setEditingSocialLink({ ...editingSocialLink, url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={handleSaveSocialLink}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingSocialLink(null)}
                        className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View social link mode
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center shadow-sm border border-gray-200 overflow-hidden">
                        {availablePlatforms.find(p => p.value === socialLink.platform)?.icon || <Share2 className="w-6 h-6 text-gray-600" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 capitalize text-base mb-1">{socialLink.platform}</h4>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{socialLink.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleEditSocialLink(socialLink)}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 font-medium"
                        title="Edit social link"
                      >
                        <Edit3 className="w-4 h-4 inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSocialLink(socialLink.id)}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 font-medium"
                        title="Delete social link"
                      >
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">No social links configured</h3>
              <p className="text-sm text-gray-500">Add social media profiles to connect with your audience</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FooterForm;
