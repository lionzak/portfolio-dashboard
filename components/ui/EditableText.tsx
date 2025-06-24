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
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Select all text for easier editing on mobile
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.rpc("update_social_link", {
        platform: platformName,
        new_link: text,
      });

      if (error) {
        console.error("Failed to update social link:", error.message);
        alert("Error updating link.");
        return;
      }

      onSave(text);
      setIsEditing(false);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setText(initialText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {isEditing ? (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed min-w-0"
            placeholder={placeholder}
          />
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-shrink-0">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label="Save"
            >
              <FiCheck size={18} />
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label="Cancel"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full group">
          <span 
            className={`flex-1 text-sm sm:text-base break-all pr-2 ${
              !text ? 'text-gray-400 italic' : 'text-gray-700'
            }`}
            style={{ wordBreak: 'break-word' }}
          >
            {text || placeholder}
          </span>
          <button
            onClick={handleEditClick}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors opacity-70 group-hover:opacity-100 flex-shrink-0 touch-manipulation"
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