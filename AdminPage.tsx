import React, { useState, useCallback, useEffect } from 'react';
import type { InputVariable, Tool, VariableFormat } from '@/types';
import PlusIcon from '@/PlusIcon';
import TrashIcon from '@/TrashIcon';

interface AdminPageProps {
    onSave: (toolData: Omit<Tool, 'id'>, id?: number) => void;
    onBack: () => void;
    toolToEdit?: Tool | null;
}

const variableFormats: VariableFormat[] = ['string', 'number', 'boolean', 'list', 'matrix', 'dict'];

const AdminPage: React.FC<AdminPageProps> = ({ onSave, onBack, toolToEdit }) => {
  const isEditing = !!toolToEdit;

  const [toolName, setToolName] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [variables, setVariables] = useState<InputVariable[]>([{ id: Date.now(), name: '', format: 'string', description: '' }]);
  const [pythonCode, setPythonCode] = useState('');

  const resetForm = useCallback(() => {
      setToolName('');
      setAvatar(null);
      setAvatarPreview(null);
      setDescription('');
      setVariables([{ id: Date.now(), name: '', format: 'string', description: '' }]);
      setPythonCode('');
      const fileInput = document.getElementById('avatar') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
  }, []);

  useEffect(() => {
    if (isEditing && toolToEdit) {
      setToolName(toolToEdit.name);
      setAvatar(null);
      setAvatarPreview(toolToEdit.avatar);
      setDescription(toolToEdit.description);
      setVariables(toolToEdit.variables.map(v => ({...v, id: v.id || Date.now() + Math.random()})));
      setPythonCode(toolToEdit.pythonCode);
    } else {
        resetForm();
    }
  }, [isEditing, toolToEdit, resetForm]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariable = useCallback(() => {
    setVariables(prev => [...prev, { id: Date.now(), name: '', format: 'string', description: '' }]);
  }, []);

  const removeVariable = useCallback((id: number) => {
    if (variables.length > 1) {
        setVariables(prev => prev.filter(v => v.id !== id));
    }
  }, [variables.length]);

  const handleVariableChange = useCallback((id: number, field: keyof Omit<InputVariable, 'id'>, value: string) => {
    setVariables(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName || !description || !pythonCode || !variables.some(v => v.name)) {
        alert('Vui lòng điền đầy đủ các trường bắt buộc: Tên, Mô tả, ít nhất một Biến, và Code Python.');
        return;
    }
    onSave({
      name: toolName,
      avatar: avatarPreview,
      description,
      variables,
      pythonCode
    }, isEditing ? toolToEdit.id : undefined);
  };

  return (
    <div className="container mx-auto max-w-4xl">
       <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
            <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{isEditing ? 'Chỉnh sửa công cụ' : 'Thêm công cụ mới'}</h1>
            <button onClick={onBack} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                &larr; Quay lại
            </button>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <label htmlFor="toolName" className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Tên công cụ</label>
            <input
              type="text"
              id="toolName"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              placeholder="Ví dụ: Máy tính phương trình bậc hai"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Hình đại diện</label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Xem trước" className="w-full h-full object-cover rounded-md"/>
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                )}
              </div>
              <input type="file" id="avatar" onChange={handleAvatarChange} accept="image/*" className="hidden"/>
              <label htmlFor="avatar" className="cursor-pointer px-4 py-2 text-sm font-medium text-white dark:text-slate-900 bg-cyan-500 dark:bg-cyan-400 rounded-md hover:bg-cyan-600 dark:hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-cyan-400 transition-colors">
                Tải ảnh lên
              </label>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Mô tả công cụ</label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            placeholder="Mô tả chức năng của công cụ. Hỗ trợ các ký hiệu toán học như α, β, ∑, ∫..."
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Các biến đầu vào</label>
          <div className="grid grid-cols-[auto_auto_1fr_auto] gap-x-2 items-center mb-2 px-2 text-sm text-slate-500 dark:text-slate-400">
             <span>Tên biến</span>
             <span>Định dạng</span>
             <span>Mô tả</span>
          </div>
          <div className="space-y-3">
            {variables.map((variable, index) => (
              <div key={variable.id} className="grid grid-cols-[auto_auto_1fr_auto] gap-x-2 items-center">
                <input
                  type="text"
                  value={variable.name}
                  onChange={(e) => handleVariableChange(variable.id, 'name', e.target.value)}
                  placeholder={`bien_${index + 1}`}
                  className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition w-36"
                  required
                />
                 <select
                    value={variable.format}
                    onChange={(e) => handleVariableChange(variable.id, 'format', e.target.value)}
                    className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition w-32"
                >
                    {variableFormats.map(format => (
                        <option key={format} value={format}>{format}</option>
                    ))}
                </select>
                <input
                  type="text"
                  value={variable.description}
                  onChange={(e) => handleVariableChange(variable.id, 'description', e.target.value)}
                  placeholder="Mô tả biến (hiển thị cho người dùng)"
                  className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  required
                />
                {variables.length > 1 && (
                    <button type="button" onClick={() => removeVariable(variable.id)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 transition rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                      <TrashIcon />
                    </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addVariable} className="mt-4 flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition">
            <PlusIcon />
            <span>Thêm biến</span>
          </button>
        </div>
        
        <div>
          <label htmlFor="pythonCode" className="block text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Code Python</label>
          <textarea
            id="pythonCode"
            rows={12}
            value={pythonCode}
            onChange={(e) => setPythonCode(e.target.value)}
            className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition font-mono text-sm"
            placeholder={`# Các thư viện numpy (dưới tên np) và matplotlib.pyplot (dưới tên plt) đã được import tự động.
#
# Sử dụng các biến đã định nghĩa ở trên.
# Ví dụ: print(f"Tổng là: {bien_1 + bien_2}")
#
# Ví dụ vẽ biểu đồ:
# x = np.linspace(0, 10, 100)
# y = np.sin(x)
# plt.plot(x, y)
# plt.title("Biểu đồ hình Sin")
#
# Kết quả từ lệnh print() và các biểu đồ sẽ được hiển thị ở output.`}
            required
          />
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button type="submit" className="px-8 py-3 font-bold text-white dark:text-slate-900 bg-cyan-500 dark:bg-cyan-400 rounded-md hover:bg-cyan-600 dark:hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors text-lg">
            {isEditing ? 'Cập nhật công cụ' : 'Xuất bản công cụ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPage;