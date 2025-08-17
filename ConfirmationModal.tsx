
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in" 
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm animate-scale-in" 
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-red-500 mb-4">{title}</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-slate-500 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-red-500 transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
