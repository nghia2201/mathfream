
import React from 'react';
import type { Tool } from '@/types';

interface HomePageProps {
    tools: Tool[];
    onSelectTool: (tool: Tool) => void;
    searchQuery: string;
}

const HomePage: React.FC<HomePageProps> = ({ tools, onSelectTool, searchQuery }) => {
  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredTools.length === 0) {
     if (searchQuery) {
        return (
            <div className="container mx-auto flex flex-col items-center justify-center text-center" style={{minHeight: 'calc(100vh - 12rem)'}}>
                <h1 className="text-3xl font-bold text-slate-700 dark:text-slate-300 mb-4">Không tìm thấy kết quả</h1>
                <p className="text-slate-500 dark:text-slate-400">Không có công cụ nào khớp với tìm kiếm của bạn cho "{searchQuery}".</p>
            </div>
        );
    }
    return (
        <div className="container mx-auto flex flex-col items-center justify-center text-center" style={{minHeight: 'calc(100vh - 12rem)'}}>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">Chào mừng đến với Web Mẫu</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
                Hiện tại chưa có công cụ nào được xuất bản. Vui lòng đăng nhập với tư cách "Admin" để thêm công cụ mới.
            </p>
        </div>
    );
  }

  return (
    <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-200 mb-8">Danh sách công cụ</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTools.map(tool => (
                <div 
                    key={tool.id} 
                    onClick={() => onSelectTool(tool)}
                    className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-none overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-cyan-500/20 group border border-slate-200 dark:border-slate-700/50 hover:border-cyan-400 dark:hover:border-cyan-500"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectTool(tool)}}
                >
                    <div className="aspect-square bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        {tool.avatar ? (
                            <img src={tool.avatar} alt={tool.name} className="w-full h-full object-cover"/>
                        ) : (
                            <div className="w-full h-full bg-slate-200 dark:bg-slate-700"></div>
                        )}
                    </div>
                    <div className="p-4">
                        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-200 truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{tool.name}</h2>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default HomePage;