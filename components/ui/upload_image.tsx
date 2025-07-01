import { Upload } from 'lucide-react'
import React, { ChangeEventHandler, MouseEventHandler, Ref } from 'react'
import Image from 'next/image'

const Upload_image = ({ triggerFileInput, fileInputRef, handleImageUpload, uploadedImage }: { triggerFileInput: MouseEventHandler<HTMLButtonElement>, fileInputRef: Ref<HTMLInputElement>, handleImageUpload: ChangeEventHandler<HTMLInputElement>, uploadedImage: string | null }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Image Upload</h2>

            <div className="space-y-4">
                <button
                    onClick={triggerFileInput}
                    className="flex items-center px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                >
                    <Upload size={20} className="mr-2" />
                    Upload Image
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />

                {uploadedImage && (
                    <div className="mt-4">
                        <Image
                            src={uploadedImage}
                            alt="Uploaded"
                            width={320}
                            height={240}
                            className="max-w-xs h-auto rounded-md border border-gray-300"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Upload_image
