'use client';
import { supabase } from '@/lib/supabaseClient';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { ExternalLink, Loader2, OctagonX, Pencil } from 'lucide-react';
import Image from 'next/image';

const ProjectsPage = () => {
    const [isProjectModalOpen, setProjectModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState<{id: string, project_name: string, project_brief: string, project_link: string, images: string[]}[]>([]);
    const [name, setName] = useState('');
    const [brief, setBrief] = useState('');
    const [link, setLink] = useState('');
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const { data, error } = await supabase.rpc('get_all_projects');
        if (error) {
            console.error('Error while fetching projects:', error.message);
        } else {
            setProjects(data);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (index === 1) setFile1(file);
        else setFile2(file);
    };

    const uploadImageAndGetUrl = async (file: File): Promise<string | null> => {
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
        if (uploadError) {
            console.error('❌ Upload error:', uploadError.message);
            return null;
        }
        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        return data?.publicUrl || null;
    };

    const handleEditProject = (project: {id: string, project_name: string, project_brief: string, project_link: string}) => {
        setName(project.project_name);
        setBrief(project.project_brief);
        setLink(project.project_link);
        setEditingProjectId(project.id);
        setProjectModalOpen(true);
        setIsEditing(true);
    };

    const addOrUpdateProject = async () => {
        if ((!file1 && !file2) || !name || !brief || !link) return;
        const imageUrls: string[] = [];

        setIsLoading(true);

        if (file1) {
            const url1 = await uploadImageAndGetUrl(file1);
            if (url1) imageUrls.push(url1);
        }

        if (file2) {
            const url2 = await uploadImageAndGetUrl(file2);
            if (url2) imageUrls.push(url2);
        }

        if (isEditing && editingProjectId) {
            const { error } = await supabase.rpc('update_project_by_id', {
                proj_id: editingProjectId,
                proj_name: name,
                proj_brief: brief,
                proj_link: link,
                image1: imageUrls[0] || null,
                image2: imageUrls[1] || null,
            });

            if (error) {
                console.error('❌ Error updating project:', error.message);
            } else {
                console.log('✅ Project updated');
            }
        } else {
            const { error } = await supabase.rpc('add_project_with_images', {
                proj_name: name,
                proj_brief: brief,
                proj_link: link,
                image1: imageUrls[0] || null,
                image2: imageUrls[1] || null,
            });

            if (error) {
                console.error('❌ Error adding project:', error.message);
            } else {
                console.log('✅ Project added');
            }
        }

        setIsLoading(false);
        fetchProjects();
        setProjectModalOpen(false);
        setName('');
        setBrief('');
        setLink('');
        setFile1(null);
        setFile2(null);
        setIsEditing(false);
        setEditingProjectId(null);
    };

    const deleteProject = async (id: string) => {
        const confirmDelete = confirm("Are you sure you want to delete this project?");
        if (!confirmDelete) return;

        const { data: projectData, error: fetchError } = await supabase
            .from('projects')
            .select('project_images (image_url)')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('❌ Failed to fetch project images:', fetchError.message);
            return;
        }

        const imageUrls = projectData.project_images.map((img: { image_url: string }) => img.image_url);
        const fileNames = imageUrls.map((url: string) => url.split('/avatars/')[1]);

        const { error: storageError } = await supabase.storage
            .from('avatars')
            .remove(fileNames);

        if (storageError) {
            console.error('❌ Failed to delete images:', storageError.message);
            return;
        }

        const { error } = await supabase.rpc('delete_project_by_id', { proj_id: id });

        if (error) {
            console.error('❌ Error deleting project:', error.message);
        } else {
            console.log('✅ Project and images deleted');
            fetchProjects();
        }
    };

    return (
        <div className='min-h-screen bg-gray-100 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 overflow-auto'>
            <Modal isOpen={isProjectModalOpen} onClose={() => setProjectModalOpen(false)}>
                <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Project' : 'Add Project'}</h2>
                <hr className='mb-4' />

                <input type="text" placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} className='w-full mb-3 px-3 py-2 border rounded' />
                <textarea placeholder="Brief" value={brief} onChange={(e) => setBrief(e.target.value)} className='w-full mb-3 px-3 py-2 border rounded' />
                <input type="text" placeholder="Project Link" value={link} onChange={(e) => setLink(e.target.value)} className='w-full mb-3 px-3 py-2 border rounded' />
                <label className='block mb-2 text-sm font-medium'>Upload Image 1</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 1)} className='mb-3 flex' />
                <label className='block mb-2 text-sm font-medium'>Upload Image 2 (optional)</label>
                <div className='flex gap-2'>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 2)} className='mb-4' />
                    <button className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded' onClick={addOrUpdateProject}>
                        {isEditing ? 'Update' : 'Submit'}
                    </button>
                </div>
            </Modal>

            {isLoading && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin h-10 w-10 text-blue-500 mb-2" />
                        <p className="text-gray-800 font-medium">Processing...</p>
                    </div>
                </div>
            )}

            <div className='text-center flex justify-center relative'>
                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold'>Projects Manager</h1>
                <div className='items-center flex absolute right-10'>
                    <button className='bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded text-white' onClick={() => setProjectModalOpen(true)}>
                        Add
                    </button>
                </div>
            </div>

            {projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-7">
                    {projects.map((project) => (
                        <div key={project.id} className='bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-2'>
                            <div className="flex justify-between items-center">
                                <h3 className='text-lg font-semibold'>
                                    <p className='text-lg text-gray-600 '>{project.project_name}</p>
                                </h3>
                                <div className='flex gap-2'>
                                    <button onClick={() => handleEditProject(project)} className='text-blue-500 hover:text-blue-700 text-sm'>
                                        <Pencil />
                                    </button>
                                    <button onClick={() => deleteProject(project.id)} className='text-red-500 hover:text-red-700 text-sm'>
                                        <OctagonX />
                                    </button>
                                </div>
                            </div>

                            <p className='text-sm text-gray-600'>{project.project_brief.length > 20 ? project.project_brief.slice(0, 20) + '...' : project.project_brief}</p>
                            <div className="flex justify-center my-2">
                                <a href={project.project_link} target='_blank' rel='noopener noreferrer' className='text-blue-600 underline text-sm flex items-center gap-1'>
                                    <span className='text-lg'>Visit:</span> <ExternalLink />
                                </a>
                            </div>

                            <div className='flex justify-around gap-2 mt-2'>
                                {project.images?.map((url: string, index: number) => (
                                    <Image key={index} width={96} height={96} src={url} alt={`Project image ${index + 1}`} className='w-24 h-24 object-cover rounded' />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='w-full flex justify-center text-center text-xl mt-4'>No Projects found</div>
            )}
        </div>
    );
};

export default ProjectsPage;
