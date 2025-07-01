// components/Modal.js
import { X } from 'lucide-react';
import React from 'react';

const Modal = ({ isOpen, onClose, children }: {isOpen: boolean, onClose: () => void, children: React.ReactNode}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          <X></X>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
