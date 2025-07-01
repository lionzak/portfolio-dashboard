import React, { useEffect, useState } from 'react'
import SkillCard from './SkillCard'
import { supabase } from '@/lib/supabaseClient'
import Modal from './Modal'
import { Upload } from 'lucide-react'

const SkillsPage = () => {

    const [skills, setSkills] = useState([]);
    const [isSkillModalOpen, setSkillModalOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFile(file);
    };

    const add_skill = async (skill_name: string) => {
        if (!file) {
            console.error("No file selected for upload.");
            return;
        }
        const fileName = `${Date.now()}_${file.name}`;
        const bucket = "avatars"; // Change if your bucket is named differently

        // Upload to Supabase
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file);

        if (error) {
            console.error("Upload failed:", error.message);
            return;
        }

        //get the public url
        const { data: urlData } = await supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        const publicUrl = urlData.publicUrl;

        console.log("✅ Public URL:", publicUrl);

        // Save directly using the retrieved URL, not imageUrl state
        const { data: addSkillData, error: addSkillError } = await supabase.rpc('add_skill', {
            new_skill_name: skill_name,
            new_skill_image: publicUrl, // ✅ not imageUrl state
        });

        if (addSkillError) {
            console.error("Failed to save skill:", addSkillError.message);
        } else {
            console.log("Skill saved:", addSkillData);
        }
        setFile(null);
        fetchSkills();
    }


    useEffect(() => {
        fetchSkills()
    }, [])

    const fetchSkills = async () => {
        const { data, error } = await supabase.rpc('get_skills')

        if (error) {
            console.log("Error while fetching skills ", error);
        }
        else {
            setSkills(data);
        }
    }


    const handleDelete = async (skillId: string) => {
        const { data: skillDataArray, error: skillFetchError } = await supabase
            .rpc('get_skill_by_id', { skill_id: skillId });

        const skillData = skillDataArray?.[0];

        if (skillFetchError || !skillData || !skillData.skill_image) {
            console.error('❌ Failed to fetch skill or image URL:', skillFetchError);
            return;
        }

        console.log("✅ Skill image URL:", skillData.skill_image);


        const imageUrl: string = skillData.skill_image;

        const fileName = imageUrl.split('/avatars/')[1];

        // Delete the image from Supabase Storage
        const { error: storageError } = await supabase.storage
            .from('avatars')
            .remove([fileName]);

        if (storageError) {
            console.error('❌ Error deleting image:', storageError.message);
        } else {
            console.log('✅ Image deleted successfully');
        }

        // Then delete the skill from the DB
        const { error: skillError } = await supabase.rpc('delete_skill', { skill_id: skillId });

        if (skillError) {
            console.error('❌ Error deleting skill:', skillError.message);
        } else {
            console.log('✅ Skill deleted successfully');
        }

        await fetchSkills();
    };


    return (
        <div className="min-h-screen bg-gray-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 overflow-auto">
            {/* header */}
            <div className='text-center flex justify-center'>
                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold'>Skills Management</h1>
                {/**add button */}
                <div className=' items-center flex absolute right-10'>
                    <button className='bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded' onClick={() => setSkillModalOpen(true)}>
                        Add
                    </button>
                </div>
            </div>


            {/* skills cards  */}
            {skills && skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-7">
                    {skills.map((skill: { skill_name: string; skill_image: string; id: string }) => (
                        <SkillCard
                            key={skill.id}
                            fetchSkills={fetchSkills}
                            skillID={skill.id}
                            imageUrl={skill.skill_image}
                            skillName={skill.skill_name}
                            handleDelete={() => handleDelete(skill.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className='w-full flex justify-center text-center text-1xl sm:text-2xl lg:text-3xl mt-4'>No skills found</div>
            )}

            <Modal isOpen={isSkillModalOpen} onClose={() => setSkillModalOpen(false)}>
                {/*title and hr */}
                <h2 className="text-2xl font-semibold mb-4">Add skill</h2>
                <hr />
                {/*content */}
                {/*text field for the skill name */}
                <div className='mb-5'>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex">
                        Skill name
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="Skill name here"
                    />
                </div>
                <div className="flex flex-col items-center justify-center p-6">
                    <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-blue-500 transition"
                    >
                        <Upload />
                        <span className="text-gray-600">Click to upload</span>
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".png, .jpg, .jpeg"
                        />
                    </label>

                    {file && (
                        <p className="mt-4 text-sm text-gray-800">
                            Selected file: <strong>{file.name}</strong>
                        </p>
                    )}
                </div>
                {/*buttons */}
                <div className='flex gap-2 justify-end'>
                    <button
                        onClick={() => setSkillModalOpen(false)}
                        className="px-4 py-2 border-2 border-gray-800 text-gray-800 rounded-full hover:bg-gray-100 transition w-24 md:w-28 lg:w-32"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                            if (input && input.value.trim() && file) {
                                add_skill(input.value.trim());
                                setSkillModalOpen(false);
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold w-24 md:w-28 lg:w-32"
                    >
                        Add
                    </button>
                </div>
            </Modal>
        </div >
    )
}
export default SkillsPage