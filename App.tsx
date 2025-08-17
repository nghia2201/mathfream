import React, { useState, useCallback, useEffect } from 'react';
import Header from '@/Header';
import HomePage from '@/HomePage';
import AdminPage from '@/AdminPage';
import AdminLoginModal from '@/AdminLoginModal';
import ToolDetailPage from '@/ToolDetailPage';
import AdminHubPage from '@/AdminHubPage';
import DeleteToolPage from '@/DeleteToolPage';
import EditToolListPage from '@/EditToolListPage';
import type { Tool } from '@/types';

const ADMIN_PASSWORD = "123";
const TOOLS_STORAGE_KEY = 'web-mau-tools';

type View = 'home' | 'adminHub' | 'addTool' | 'deleteTool' | 'tool' | 'editToolList';
type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const savedTheme = localStorage.getItem('theme') as Theme;
  return savedTheme || 'light';
};

const App: React.FC = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const [view, setView] = useState<View>('home');

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [tools, setTools] = useState<Tool[]>(() => {
    try {
      const savedTools = localStorage.getItem(TOOLS_STORAGE_KEY);
      return savedTools ? JSON.parse(savedTools) : [];
    } catch (error) {
      console.error("Không thể tải công cụ từ localStorage", error);
      return [];
    }
  });

  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [toolToEdit, setToolToEdit] = useState<Tool | null>(null);
  
  useEffect(() => {
    try {
        localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(tools));
    } catch(error) {
        console.error("Không thể lưu công cụ vào localStorage", error);
    }
  }, [tools]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  const handleAdminClick = useCallback(() => {
    if (isAdminLoggedIn) {
      setView('adminHub');
    } else {
      setIsLoginModalOpen(true);
    }
  }, [isAdminLoggedIn]);

  const handleCloseModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const handleLogin = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setIsLoginModalOpen(false);
      setView('adminHub');
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    setIsAdminLoggedIn(false);
    setView('home');
  }, []);
  
  const handleGoHome = useCallback(() => {
      setView('home');
      setSelectedTool(null);
      setToolToEdit(null);
  }, []);

  const handleGoToAdminHub = useCallback(() => {
    setView('adminHub');
    setToolToEdit(null);
  }, []);
  
  const handleNavigateToAdd = useCallback(() => {
    setToolToEdit(null);
    setView('addTool');
  }, []);

  const handleNavigateToEditList = useCallback(() => {
      setView('editToolList');
  }, []);

  const handleSelectToolToEdit = useCallback((tool: Tool) => {
      setToolToEdit(tool);
      setView('addTool');
  }, []);
  
  const handleSaveTool = useCallback((toolData: Omit<Tool, 'id'>, id?: number) => {
    if (id) {
        setTools(prev => prev.map(t => t.id === id ? { ...t, ...toolData, id } : t));
        alert('Công cụ đã được cập nhật thành công!');
    } else {
        const newTool: Tool = { ...toolData, id: Date.now() };
        setTools(prev => [...prev, newTool]);
        alert('Công cụ đã được xuất bản thành công!');
    }
    setView('adminHub');
    setToolToEdit(null);
  }, []);

  const handleDeleteTool = useCallback((toolId: number) => {
      setTools(prevTools => prevTools.filter(tool => tool.id !== toolId));
      alert('Công cụ đã được xóa.');
      setView('adminHub');
  }, []);

  const handleDeleteToolAndGoHome = useCallback((toolId: number) => {
    setTools(prevTools => prevTools.filter(tool => tool.id !== toolId));
    alert('Công cụ đã được xóa thành công!');
    setView('home');
    setSelectedTool(null);
  }, []);

  const handleSelectTool = useCallback((tool: Tool) => {
      setSelectedTool(tool);
      setView('tool');
  }, []);

  const renderContent = () => {
    switch(view) {
        case 'tool':
            return selectedTool ? <ToolDetailPage tool={selectedTool} onBack={handleGoHome} isAdmin={isAdminLoggedIn} onDelete={handleDeleteToolAndGoHome} /> : <HomePage tools={tools} onSelectTool={handleSelectTool} searchQuery={searchQuery} />;
        case 'adminHub':
            return <AdminHubPage onNavigateToAdd={handleNavigateToAdd} onNavigateToEdit={handleNavigateToEditList} onNavigateToDelete={() => setView('deleteTool')} />;
        case 'addTool':
             return <AdminPage onSave={handleSaveTool} onBack={handleGoToAdminHub} toolToEdit={toolToEdit} />;
        case 'deleteTool':
             return <DeleteToolPage tools={tools} onDelete={handleDeleteTool} onBack={handleGoToAdminHub} />;
        case 'editToolList':
             return <EditToolListPage tools={tools} onSelectTool={handleSelectToolToEdit} onBack={handleGoToAdminHub} />;
        default:
             return <HomePage tools={tools} onSelectTool={handleSelectTool} searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <Header 
        onAdminClick={handleAdminClick} 
        isAdmin={isAdminLoggedIn} 
        onLogout={handleLogout} 
        onHomeClick={handleGoHome} 
        onGoToAdminHub={handleGoToAdminHub}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
       />
      <main className="p-4 sm:p-6 md:p-8">
        {renderContent()}
      </main>
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseModal}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default App;