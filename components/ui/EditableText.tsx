import React, { useState, useRef, useEffect } from 'react';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { supabase } from "@/lib/supabaseClient";

interface EditableTextProps {
  initialText: string;
  onSave: (newText: string) => void;
  placeholder?: string;
  className?: string;
  platformName: string;
}

const EditableText: React.FC<EditableTextProps> = ({
  initialText,
  onSave,
  placeholder = 'Click to edit',
  className = '',
  platformName
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };


  const handleSave = async () => {
    const { error } = await supabase.rpc("update_social_link", {
      platform: platformName, // e.g., "facebook", "linkedin"
      new_link: text,         // the new URL the user typed
    });

    if (error) {
      console.error("Failed to update social link:", error.message);
      alert("Error updating link.");
      return;
    }

    onSave(text); // call parent callback if needed
    setIsEditing(false); // close editing UI
  };

  const handleCancel = () => {
    setText(initialText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:text-green-800"
            aria-label="Save"
          >
            <FiCheck size={18} />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-red-600 hover:text-red-800"
            aria-label="Cancel"
          >
            <FiX size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className={`${!text ? 'text-gray-400' : ''}`}>
            {text || placeholder}
          </span>
          <button
            onClick={handleEditClick}
            className="p-1 text-gray-500 hover:text-blue-600"
            aria-label="Edit"
          >
            <FiEdit2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableText;