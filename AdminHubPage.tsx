import React from 'react';

interface AdminHubPageProps {
  onNavigateToAdd: () => void;
  onNavigateToEdit: () => void;
  onNavigateToDelete: () => void;
}

const AdminHubPage: React.FC<AdminHubPageProps> = ({ onNavigateToAdd, onNavigateToEdit, onNavigateToDelete }) => {
  return (
    <div className="container mx-auto max-w-4xl text-center">
      <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-8">Bảng điều khiển Admin</h1>
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <button
          onClick={onNavigateToAdd}
          className="w-full sm:w-auto flex-1 bg-cyan-500 text-white dark:bg-cyan-400 dark:text-slate-900 font-bold py-6 px-8 rounded-lg shadow-lg hover:bg-cyan-600 dark:hover:bg-cyan-500 transition-all transform hover:scale-105"
        >
          <span className="text-2xl">Thêm công cụ</span>
        </button>
        <button
          onClick={onNavigateToEdit}
          className="w-full sm:w-auto flex-1 bg-blue-600 text-white dark:bg-blue-400 dark:text-slate-900 font-bold py-6 px-8 rounded-lg shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-all transform hover:scale-105"
        >
          <span className="text-2xl">Sửa công cụ</span>
        </button>
        <button
          onClick={onNavigateToDelete}
          className="w-full sm:w-auto flex-1 bg-red-600 text-white dark:bg-red-400 dark:text-slate-900 font-bold py-6 px-8 rounded-lg shadow-lg hover:bg-red-700 dark:hover:bg-red-500 transition-all transform hover:scale-105"
        >
          <span className="text-2xl">Xóa công cụ</span>
        </button>
      </div>
    </div>
  );
};

export default AdminHubPage;