
import React from 'react';
import SearchIcon from '@/SearchIcon';

interface HeaderProps {
  onAdminClick: () => void;
  isAdmin: boolean;
  onLogout: () => void;
  onHomeClick: () => void;
  onGoToAdminHub: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}


const DarkModeToggle: React.FC<{ theme: 'light' | 'dark'; onToggle: () => void }> = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';
  return (
    <button
      onClick={onToggle}
      className={`relative w-[90px] h-8 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ${isDark ? 'bg-blue-600' : 'bg-slate-300'}`}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
    >
      <div
        className={`absolute bg-white w-6 h-6 rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 ${isDark ? 'translate-x-0' : 'translate-x-[58px]'}`}
      >
        {isDark ? (
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        ) : (
          <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        )}
      </div>
      <span className={`absolute right-3 text-xs font-bold transition-opacity select-none ${isDark ? 'opacity-100 text-slate-100' : 'opacity-0'}`}>NIGHT</span>
      <span className={`absolute left-4 text-xs font-bold transition-opacity select-none ${!isDark ? 'opacity-100 text-slate-600' : 'opacity-0'}`}>DAY</span>
    </button>
  );
};


const Header: React.FC<HeaderProps> = ({ onAdminClick, isAdmin, onLogout, onHomeClick, onGoToAdminHub, theme, onToggleTheme, searchQuery, onSearchChange }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-24">
          
          <div className="flex-shrink-0">
            <button onClick={onHomeClick} className="text-2xl font-bold tracking-wider text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              Tên trang web
            </button>
            <div className="mt-2">
              <DarkModeToggle theme={theme} onToggle={onToggleTheme} />
            </div>
          </div>

          <div className="flex-1 flex justify-center px-4 sm:px-8">
             <div className="relative w-full max-w-md">
                <input
                    type="search"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full h-10 px-4 py-2 pl-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <SearchIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <div className="flex items-center gap-4">
              {isAdmin ? (
                <>
                  <button
                    onClick={onGoToAdminHub}
                    className="px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-slate-400 transition-colors"
                  >
                    Bảng điều khiển
                  </button>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-red-500 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <button
                  onClick={onAdminClick}
                  className="px-4 py-2 text-sm font-medium text-white dark:text-slate-900 bg-cyan-600 dark:bg-cyan-400 rounded-md hover:bg-cyan-700 dark:hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors font-semibold"
                >
                  Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;