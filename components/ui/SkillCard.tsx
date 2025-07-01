'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Check, OctagonX, Pen, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const SkillCard = ({ imageUrl, skillName, handleDelete, skillID, fetchSkills }: { imageUrl: string, skillName: string, handleDelete: () => Promise<void>, skillID: string, fetchSkills: () => void }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [newSkillName, setNewSkillName] = useState(skillName);
    const [file, setFile] = useState<File | null>(null);


    const handleEdit = () => {
        setIsEditing(true);
    }


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFile(file);
    };

    const updateSkill = async () => {
        if (!file || !newSkillName) return;

        const fileName = `${Date.now()}_${file.name}`;
        const bucket = "avatars";

        const deletedFileName = imageUrl.split('/avatars/')[1];

        // Delete the image from Supabase Storage
        const { error: deleteStorageError } = await supabase.storage
            .from('avatars')
            .remove([deletedFileName]);

        if (deleteStorageError) {
            console.error('❌ Error deleting image:', deleteStorageError.message);
        } else {
            console.log('✅ Image deleted successfully');
        }

        const { error: storageError } = await supabase.storage
            .from(bucket)
            .upload(fileName, file);

        if (storageError) {
            console.error("Upload failed:", storageError.message);
            return;
        }

        //get the public url
        const { data: urlData } = await supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        const publicUrl = urlData.publicUrl;

        const { error: skillError } = await supabase.rpc('update_skill_by_id', { skill_id: skillID, new_name: newSkillName, new_image: publicUrl || imageUrl });

        if (skillError) {
            alert("Skill not updated")
        }
        else {
            alert("Skill updated")
            setIsEditing(false);
            fetchSkills()
        }

    }

    return (
        <div className="shadow-lg rounded-xl p-3 flex justify-between items-center w-full max-w-md h-28 hover:scale-105 transition duration-300">
            {isEditing ? (
                <>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 relative flex-shrink-0 mr-4">
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center w-24  h-20 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-blue-500 transition"
                            >
                                <Upload />
                                <span className="text-gray-600">Click to upload</span>
                                <input
                                    onChange={handleFileChange}
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept=".png, .jpg, .jpeg"
                                />
                            </label>
                        </div>
                        <input
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            autoFocus
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="Skill name here"
                        />
                    </div>

                    <div className="space">
                        <button onClick={handleEdit}>
                            <Check className='text-green-500' onClick={updateSkill} />
                        </button>
                        <button onClick={() => { setIsEditing(false); setFile(null); setNewSkillName(skillName) }}>
                            <X className='text-red-500' />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 relative flex-shrink-0">
                            <Image
                                src={imageUrl}
                                alt="Skill icon"
                                fill
                                className="rounded object-contain"
                            />
                        </div>
                        <h1 className="text-2xl font-medium">{skillName}</h1>
                    </div>

                    <div className="space-x-1">
                        <button onClick={handleEdit}>
                            <Pen className='text-blue-400'/>
                        </button>
                        <button onClick={handleDelete}>
                            <OctagonX  className='text-red-500'/>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default SkillCard
