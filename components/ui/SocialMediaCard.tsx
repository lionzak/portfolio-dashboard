import React from 'react';
import { FaFacebook, FaLinkedin , FaWhatsapp } from 'react-icons/fa';
import EditableText from './EditableText';

const handleSave = (newText: string) => {
    setTimeout(() => console.log("asd")
        , 2000);
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
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            {/* Platform header with circle icon */}
            <div className="flex items-center p-4">
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl ${platformColors[platform]}`}
                >
                    {platformIcons[platform]}
                </div>
                <div className="ml-4 flex items-center flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 capitalize">
                        {platform}
                    </h2>
                </div>
                <EditableText initialText={content} onSave={handleSave} platformName={platform}/>
                <div className="ml-auto">
                    <h2>clicks: {clicks}👆</h2>
                </div>
            </div>
        </div>
    );
};

export default SocialMediaCard;