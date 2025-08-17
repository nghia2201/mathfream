import React from 'react';
import type { Tool } from '@/types';
import EditIcon from '@/EditIcon';

interface EditToolListPageProps {
  tools: Tool[];
  onSelectTool: (tool: Tool) => void;
  onBack: () => void;
}

const EditToolListPage: React.FC<EditToolListPageProps> = ({ tools, onSelectTool, onBack }) => {
  return (
    <div className="container mx-auto max-w-2xl">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">Sửa công cụ</h1>
        <button onClick={onBack} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
          &larr; Quay lại
        </button>
      </div>
      
      {tools.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400 text-center py-8">Không có công cụ nào để sửa.</p>
      ) : (
        <div className="space-y-4">
          {tools.map(tool => (
            <div 
              key={tool.id} 
              onClick={() => onSelectTool(tool)}
              className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg flex items-center justify-between shadow dark:shadow-none border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-cyan-400 dark:hover:border-cyan-500 transition-colors group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectTool(tool)}}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-md flex-shrink-0">
                    {tool.avatar ? (
                        <img src={tool.avatar} alt={tool.name} className="w-full h-full object-cover rounded-md"/>
                    ) : (
                        <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                    )}
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{tool.name}</span>
              </div>
              <div
                className="p-3 text-slate-500 dark:text-slate-400 group-hover:text-cyan-500"
                aria-label={`Sửa công cụ ${tool.name}`}
              >
                <EditIcon />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditToolListPage;
