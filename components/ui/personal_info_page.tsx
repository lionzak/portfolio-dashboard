'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import Upload_image from './upload_image'

interface TextFieldState {
  value: string
  isEditing: boolean
  originalValue: string
}

export default function PersonaInfoPage() {
  const [aboutText, setAboutText] = useState<TextFieldState>({
    value: '',
    isEditing: false,
    originalValue: ''
  })

  const [briefText, setBriefText] = useState<TextFieldState>({
    value: '',
    isEditing: false,
    originalValue: ''
  })

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [effectColor, setEffectColor] = useState("#3a6cf4"); // default fallback


  // Function triggered on successful upload

  const onUploadSuccess = async (imageUrl: string) => {
    console.log('Image uploaded successfully:', imageUrl);

    const { error } = await supabase.rpc("update_personal_image_url", {
      new_image_url: imageUrl,
    });

    if (error) {
      console.error("Failed to update image URL:", error.message);
      alert("Error saving image URL.");
      return;
    }

    alert("Image uploaded and saved successfully!");
  };

  const handleEdit = (field: 'about' | 'brief') => {
    if (field === 'about') {
      setAboutText(prev => ({
        ...prev,
        isEditing: true,
        originalValue: prev.value
      }))
    } else {
      setBriefText(prev => ({
        ...prev,
        isEditing: true,
        originalValue: prev.value
      }))
    }
  }

  const handleSave = async (field: 'about' | 'brief') => {
    const value = field === 'about' ? aboutText.value : briefText.value;

    const rpcName = field === 'about' ? 'update_about' : 'update_brief';
    const paramKey = field === 'about' ? 'new_about' : 'new_brief';

    const { error } = await supabase.rpc(rpcName, {
      [paramKey]: value,
    });

    if (error) {
      console.error("Error saving personal info:", error.message);
      return;
    }

    if (field === 'about') {
      setAboutText(prev => ({
        ...prev,
        isEditing: false,
        originalValue: prev.value,
      }));
    } else {
      setBriefText(prev => ({
        ...prev,
        isEditing: false,
        originalValue: prev.value,
      }));
    }
  };

  const handleColorSave = async () => {
    const { error } = await supabase.rpc("update_effect_color", {
      new_color: effectColor,
    });

    if (error) {
      console.error("Failed to update color:", error.message);
      alert("Error saving color");
      return;
    }

    alert("Color updated!");
  };

  const handleCancel = (field: 'about' | 'brief') => {
    if (field === 'about') {
      setAboutText(prev => ({
        ...prev,
        isEditing: false,
        value: prev.originalValue
      }))
    } else {
      setBriefText(prev => ({
        ...prev,
        isEditing: false,
        value: prev.originalValue
      }))
    }
  }

  const handleTextChange = (field: 'about' | 'brief', value: string) => {
    if (field === 'about') {
      setAboutText(prev => ({ ...prev, value }))
    } else {
      setBriefText(prev => ({ ...prev, value }))
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = "profile_picture"; // fixed name
    const bucket = "avatars"; // make sure this bucket exists

    // Upload or overwrite the image
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        upsert: true, // overwrite if already exists
      });

    if (uploadError) {
      console.error("❌ Upload failed:", uploadError.message);
      alert("Image upload failed.");
      return;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;
    setUploadedImage(publicUrl); // show it
    onUploadSuccess(publicUrl); // save in DB
  };


  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const fetchPersonalInfo = async () => {
    const { data, error } = await supabase.rpc("get_personal_info");

    if (error) {
      console.error("Failed to fetch personal info:", error.message);
      return;
    }

    if (data && data.length > 0) {
      const personal = data[0]; // Get the first row

      setAboutText({
        value: personal.about || "",
        originalValue: personal.about || "",
        isEditing: false,
      });

      setBriefText({
        value: personal.brief || "",
        originalValue: personal.brief || "",
        isEditing: false,
      });

      if (personal.image_url) {
        setUploadedImage(personal.image_url); // 👈 display the uploaded image
      }

      if (personal.effect_color) {
        setEffectColor(personal.effect_color);
      }

    }
  };

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Content Editor</h1>

        {/* About Text Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">About Text</h2>
            {!aboutText.isEditing && (
              <button
                onClick={() => handleEdit('about')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {aboutText.isEditing ? (
            <div className="space-y-4">
              <textarea
                value={aboutText.value}
                onChange={(e) => handleTextChange('about', e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter about text..."
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSave('about')}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <Check size={16} className="mr-2" />
                  Save
                </button>
                <button
                  onClick={() => handleCancel('about')}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </button>

              </div>

            </div>

          ) : (
            <div className="p-3 bg-gray-50 rounded-md min-h-[8rem] flex items-center">
              <p className="text-gray-700">
                {aboutText.value || 'No about text added yet. Click Edit to add content.'}
              </p>
            </div>
          )}


          <div className="mt-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">About Text</h2>
              <div className="flex items-center">
                <input
                  type="color"
                  value={effectColor}
                  onChange={(e) => setEffectColor(e.target.value)}
                  className="w-16 h-10 p-0 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleColorSave}
                  className="ml-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
                >
                  Save Color
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Brief Text Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Brief Text</h2>
            {!briefText.isEditing && (
              <button
                onClick={() => handleEdit('brief')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {briefText.isEditing ? (
            <div className="space-y-4">
              <textarea
                value={briefText.value}
                onChange={(e) => handleTextChange('brief', e.target.value)}
                className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter brief text..."
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSave('brief')}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <Check size={16} className="mr-2" />
                  Save
                </button>
                <button
                  onClick={() => handleCancel('brief')}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md min-h-[6rem] flex items-center">
              <p className="text-gray-700">
                {briefText.value || 'No brief text added yet. Click Edit to add content.'}
              </p>
            </div>
          )}
        </div>

        {/* Image Upload Section */}
        <Upload_image triggerFileInput={triggerFileInput} fileInputRef={fileInputRef} handleImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
      </div>
    </div>
  )
}