import React from 'react';
import { FaFacebook, FaLinkedin , FaWhatsapp } from 'react-icons/fa';
import EditableText from './EditableText';

const handleSave = () => {
    setTimeout(() => console.log("asd"), 2000);
};

interface SocialMediaCardProps {
    platform: 'facebook' | 'whatsapp' | 'linkedin'
    content: string;
    clicks: number;
}

const platformIcons = {
    facebook: <FaFacebook />,
    linkedin: <FaLinkedin />,
    whatsapp: <FaWhatsapp />,
};

const platformColors = {
    facebook: 'bg-blue-600',
    linkedin: 'bg-blue-700',
    whatsapp: 'bg-green-500'
};

const SocialMediaCard: React.FC<SocialMediaCardProps> = ({
    platform,
    content,
    clicks,
}) => {
    return (
        <div className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            {/* Platform header */}
            <div className="p-4 sm:p-6">
                {/* Top section: Icon and Platform name */}
                <div className="flex items-center mb-4">
                    <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl ${platformColors[platform]} flex-shrink-0`}
                    >
                        {platformIcons[platform]}
                    </div>
                    <h2 className="ml-3 sm:ml-4 text-lg sm:text-xl font-semibold text-gray-800 capitalize">
                        {platform}
                    </h2>
                </div>

                {/* Middle section: Editable content */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link URL:
                    </label>
                    <EditableText 
                        initialText={content} 
                        onSave={handleSave} 
                        platformName={platform}
                        className="w-full"
                    />
                </div>

                {/* Bottom section: Clicks counter */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                        <span className="text-sm sm:text-base text-gray-600">Clicks:</span>
                        <span className="ml-2 text-lg sm:text-xl font-bold text-gray-800">{clicks}</span>
                        <span className="ml-1 text-lg">👆</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                        {clicks > 0 ? 'Active' : 'No clicks yet'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialMediaCard;