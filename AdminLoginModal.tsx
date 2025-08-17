
import React, { useState, useEffect } from 'react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(password)) {
      setError('Mật khẩu không đúng. Vui lòng thử lại.');
      setPassword('');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-cyan-600 dark:text-cyan-400">Đăng nhập Admin</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white dark:text-slate-900 bg-cyan-500 dark:bg-cyan-400 rounded-md hover:bg-cyan-600 dark:hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
