
import React, { useState } from 'react';
import type { Tool } from '@/types';
import TrashIcon from '@/TrashIcon';
import ConfirmationModal from '@/ConfirmationModal';

interface DeleteToolPageProps {
  tools: Tool[];
  onDelete: (toolId: number) => void;
  onBack: () => void;
}

const DeleteToolPage: React.FC<DeleteToolPageProps> = ({ tools, onDelete, onBack }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);

  const handleOpenConfirmModal = (tool: Tool) => {
    setToolToDelete(tool);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setToolToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (toolToDelete) {
      onDelete(toolToDelete.id);
    }
    handleCloseConfirmModal();
  };


  return (
    <>
      <div className="container mx-auto max-w-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
          <h1 className="text-3xl font-bold text-red-500">Xóa công cụ</h1>
          <button onClick={onBack} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
            &larr; Quay lại
          </button>
        </div>
        
        {tools.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">Không có công cụ nào để xóa.</p>
        ) : (
          <div className="space-y-4">
            {tools.map(tool => (
              <div key={tool.id} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex items-center justify-between shadow dark:shadow-none border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-md flex-shrink-0">
                      {tool.avatar ? (
                          <img src={tool.avatar} alt={tool.name} className="w-full h-full object-cover rounded-md"/>
                      ) : (
                          <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                      )}
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{tool.name}</span>
                </div>
                <button 
                  onClick={() => handleOpenConfirmModal(tool)}
                  className="p-3 text-slate-500 dark:text-slate-400 hover:text-red-500 transition rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                  aria-label={`Xóa công cụ ${tool.name}`}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa công cụ "${toolToDelete?.name}" không? Hành động này không thể hoàn tác.`}
      />
    </>
  );
};

export default DeleteToolPage;
