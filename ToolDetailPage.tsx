
import React, { useState, useCallback, useEffect } from 'react';
import type { Tool, VariableFormat } from '@/types';
import TrashIcon from '@/TrashIcon';
import ConfirmationModal from '@/ConfirmationModal';

// Định nghĩa các kiểu cho Pyodide
interface Pyodide {
  runPythonAsync: (code: string, options?: { globals: any }) => Promise<any>;
  globals: any;
  loadPackage: (packages: string[] | string) => Promise<void>;
  pyimport: (name: string) => any;
}

declare global {
  interface Window {
    loadPyodide: (options?: { indexURL: string }) => Promise<Pyodide>;
    pyodide?: Pyodide;
  }
}

interface ToolDetailPageProps {
  tool: Tool;
  onBack: () => void;
  isAdmin: boolean;
  onDelete: (toolId: number) => void;
}

const formatValueForPython = (value: string, format: VariableFormat): string => {
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
        switch (format) {
            case 'string': return '""';
            case 'number': return '0';
            case 'boolean': return 'False';
            case 'list': return '[]';
            case 'matrix': return '[]';
            case 'dict': return '{}';
            default: return 'None';
        }
    }

    switch (format) {
        case 'number':
            return String(Number(trimmedValue) || 0);
        case 'boolean':
            return ['true', '1', 'yes', 'on'].includes(trimmedValue.toLowerCase()) ? 'True' : 'False';
        case 'string':
            if (trimmedValue.includes('\n')) {
                return `"""${trimmedValue.replace(/"""/g, '\\"\\"\\"')}"""`;
            }
            return `"${trimmedValue.replace(/"/g, '\\"')}"`;
        case 'dict':
             return trimmedValue;
        case 'list': {
            const items = trimmedValue.split(/[\n,]+/).map(item => item.trim()).filter(item => item !== '');
            const pyItems = items.map(item => {
                const cleanItem = item.trim();
                if (!isNaN(Number(cleanItem)) && cleanItem !== '') {
                    return cleanItem;
                } else {
                    return `"${cleanItem.replace(/"/g, '\\"')}"`;
                }
            });
            const result = `[${pyItems.join(', ')}]`;
            return `np.array(${result})`;
        }
        case 'matrix': {
            const rows = trimmedValue.split('\n').map(row => row.trim()).filter(row => row !== '');
            const pyMatrix = rows.map(row => {
                const items = row.split(',').map(item => item.trim()).filter(item => item !== '');
                const pyItems = items.map(item => {
                    const cleanItem = item.trim();
                    if (!isNaN(Number(cleanItem)) && cleanItem !== '') {
                        return cleanItem;
                    } else {
                        return `"${cleanItem.replace(/"/g, '\\"')}"`;
                    }
                });
                return `[${pyItems.join(', ')}]`;
            });
            const result = `[${pyMatrix.join(', ')}]`;
            return `np.array(${result})`;
        }
        default:
             if (trimmedValue.includes('\n')) {
                 return `"""${trimmedValue.replace(/"""/g, '\\"\\"\\"')}"""`;
             }
             return `"${trimmedValue.replace(/"/g, '\\"')}"`;
    }
};

const getPlaceholderText = (format: VariableFormat): string => {
    switch (format) {
        case 'list': return 'Nhập các mục, phân tách bằng dấu phẩy hoặc xuống dòng.';
        case 'matrix': return 'Các hàng trên các dòng mới.\nCác giá trị trong hàng phân tách bằng dấu phẩy.\nVd:\n1,2,3\n4,5,6';
        case 'dict': return 'Nhập một đối tượng JSON hoặc Python dict hợp lệ.\nVd: {"key": "value", "number": 123}';
        case 'boolean': return 'Nhập true/false, 1/0, ...';
        default: return `Nhập giá trị (${format})...`;
    }
};


const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ tool, onBack, isAdmin, onDelete }) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string>('');
  const [outputImages, setOutputImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [debugCode, setDebugCode] = useState<string>('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [pyodide, setPyodide] = useState<Pyodide | null>(null);
  const [pyodideStatus, setPyodideStatus] = useState('Đang tải...');
  
  useEffect(() => {
    const initPyodide = async () => {
      if (window.pyodide) {
          setPyodide(window.pyodide);
          setPyodideStatus('Sẵn sàng');
          return;
      }
      
      setIsLoading(true);
      setPyodideStatus('Đang tải môi trường Python...');

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
      script.onload = async () => {
        try {
          const pyodideInstance = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
          });
          setPyodideStatus('Đang tải thư viện khoa học...');
          await pyodideInstance.loadPackage(['matplotlib', 'numpy']);
          window.pyodide = pyodideInstance;
          setPyodide(pyodideInstance);
          setPyodideStatus('Sẵn sàng');
        } catch (err: any) {
          setError(`Lỗi khởi tạo môi trường Python: ${err.message}`);
          setPyodideStatus('Lỗi');
        } finally {
            setIsLoading(false);
        }
      };
      script.onerror = () => {
        setError('Không thể tải môi trường Python. Vui lòng kiểm tra kết nối mạng và thử tải lại trang.');
        setPyodideStatus('Lỗi');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    if (!pyodide) {
        initPyodide();
    }
  }, [pyodide]);


  const handleInputChange = (variableName: string, value: string) => {
    setInputValues(prev => ({ ...prev, [variableName]: value }));
  };

  const handleCalculate = useCallback(async () => {
    if (!pyodide || pyodideStatus !== 'Sẵn sàng') {
      setError('Môi trường thực thi Python chưa sẵn sàng. Vui lòng đợi.');
      return;
    }

    setIsLoading(true);
    setError('');
    setOutput('');
    setOutputImages([]);
    setDebugCode('');
    
    // This buffer will be passed to Python and modified in place.
    const resultsBuffer = {
        output: '',
        images: [],
        error: ''
    };
    
    try {
        const inputsSection = tool.variables.map(variable => {
            const rawValue = inputValues[variable.name] || '';
            let formattedValue = formatValueForPython(rawValue, variable.format);
            return `${variable.name} = ${formattedValue}`;
        }).join('\n');

        const userCode = `${inputsSection}\n\n${tool.pythonCode}`;
        setDebugCode(`import numpy as np\nimport matplotlib.pyplot as plt\n\n${userCode}`);
        
        const pythonWrapperCode = `
import sys
import io
import base64
import traceback
import matplotlib
import matplotlib.pyplot as plt
import numpy as np

# results_buffer is in the global scope from Javascript

matplotlib.use('agg')

# Redirect stdout to capture print() statements
stdout_capture = io.StringIO()
sys.stdout = stdout_capture

try:
    # The user's code is passed in the 'user_code' variable
    exec(user_code, globals())

    # Capture all generated matplotlib plots
    image_list = []
    for fignum in plt.get_fignums():
        fig = plt.figure(fignum)
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight')
        buf.seek(0)
        image_list.append(base64.b64encode(buf.read()).decode('utf-8'))
    plt.close('all')
    
    # Put the list of base64 images into the buffer
    # Use to_js to convert Python list to JS array
    from pyodide.ffi import to_js
    results_buffer.images = to_js(image_list)

except Exception:
    # Capture any error and put it in the buffer
    results_buffer.error = traceback.format_exc()
finally:
    # Always restore stdout and capture its content
    sys.stdout = sys.__stdout__
    results_buffer.output = stdout_capture.getvalue()
`;
        const globals = pyodide.globals.get('dict')();
        globals.set('user_code', userCode);
        globals.set('results_buffer', resultsBuffer);

        await pyodide.runPythonAsync(pythonWrapperCode, { globals });
        
        // After execution, read the results from the buffer
        if (resultsBuffer.error) {
            setError(resultsBuffer.error);
        } else {
            setOutput(resultsBuffer.output);
            setOutputImages(resultsBuffer.images);
        }

    } catch (e: any) {
        setError(`Đã xảy ra lỗi nghiêm trọng khi chạy Pyodide: ${e.message}\n${e.stack}`);
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  }, [tool, inputValues, pyodide, pyodideStatus]);
  
  const handleConfirmDelete = () => {
    onDelete(tool.id);
    setIsConfirmModalOpen(false); 
  };

  const handleDelete = () => {
    setIsConfirmModalOpen(true);
  };
  
  const renderResults = () => {
    const hasResults = output || outputImages.length > 0;

    if (!isLoading && !hasResults && !error) {
        return null; // Don't show the results box if there's nothing to show
    }
    
    let title = "Kết quả";
    let titleColor = "text-green-500 dark:text-green-400";
    if (isLoading) {
        title = "Đang xử lý...";
        titleColor = "text-cyan-600 dark:text-cyan-400";
    } else if (error) {
        title = "Đã xảy ra lỗi";
        titleColor = "text-red-500 dark:text-red-400";
    }

    return (
        <div className="bg-slate-100/50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
            <h2 className={`text-xl font-semibold ${titleColor} mb-4`}>{title}</h2>
            {isLoading && <p className="text-slate-500 dark:text-slate-400 animate-pulse">Đang chờ kết quả...</p>}
            {error && <pre className="text-red-500 dark:text-red-400 bg-red-500/10 p-4 rounded-md whitespace-pre-wrap break-words"><code>{error}</code></pre>}
            {!isLoading && !error && (
                <>
                    {outputImages.length > 0 && (
                        <div className="space-y-4 mb-4">
                            {outputImages.map((imageSrc, index) => (
                                <div key={index} className="bg-white dark:bg-slate-800 p-2 rounded-lg inline-block mr-4 mb-4 shadow-md">
                                    <img src={`data:image/png;base64,${imageSrc}`} alt={`Kết quả hình vẽ ${index + 1}`} className="max-w-full h-auto rounded-sm" />
                                </div>
                            ))}
                        </div>
                    )}
                    {output && <pre className="text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-900 p-4 rounded-md whitespace-pre-wrap break-words"><code>{output}</code></pre>}
                    {!output && outputImages.length === 0 && <p className="text-slate-500 dark:text-slate-400">Mã đã chạy xong nhưng không có kết quả nào.</p>}
                </>
            )}
        </div>
    );
  };

  return (
    <>
      <div className="container mx-auto max-w-3xl">
        <button onClick={onBack} className="mb-6 text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">&larr; Quay lại danh sách</button>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg dark:shadow-none border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">{tool.name}</h1>
            {isAdmin && (
                <button
                    onClick={handleDelete}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                    aria-label={`Xóa công cụ ${tool.name}`}
                >
                    <TrashIcon />
                </button>
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400 mb-8 whitespace-pre-wrap">{tool.description}</p>

          <div className="space-y-6">
              <div className="bg-slate-100/50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-semibold text-cyan-600 dark:text-cyan-400 mb-4">Dữ liệu đầu vào</h2>
                  <div className="space-y-4">
                      {tool.variables.map(variable => (
                          <div key={variable.id}>
                              <label htmlFor={`ai-${variable.name}`} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                                  {variable.description} (<code className="text-xs bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">{variable.name}</code>: <code className="text-xs bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">{variable.format}</code>)
                              </label>
                              <textarea
                                  id={`ai-${variable.name}`}
                                  value={inputValues[variable.name] || ''}
                                  onChange={(e) => handleInputChange(variable.name, e.target.value)}
                                  placeholder={getPlaceholderText(variable.format)}
                                  className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition font-mono text-sm resize-y"
                                  rows={variable.format === 'matrix' || variable.format === 'list' ? 4 : 2}
                              />
                          </div>
                      ))}
                      <div className="flex justify-end">
                          <button 
                              onClick={handleCalculate}
                              disabled={pyodideStatus !== 'Sẵn sàng' || isLoading}
                              className="px-6 py-2 font-semibold text-white dark:text-slate-900 bg-cyan-500 dark:bg-cyan-400 rounded-md hover:bg-cyan-600 dark:hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:text-slate-600 dark:disabled:text-slate-400 disabled:cursor-not-allowed"
                          >
                              {pyodideStatus !== 'Sẵn sàng' ? pyodideStatus : (isLoading ? 'Đang xử lý...' : 'Xem kết quả')}
                          </button>
                      </div>
                  </div>
              </div>

              <div className="space-y-6">
                  {isAdmin && debugCode && (
                      <div className="bg-slate-100/50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                          <h2 className="text-xl font-semibold text-yellow-500 dark:text-yellow-400 mb-4">Mã python được thực thi</h2>
                          <pre className="text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-900 p-4 rounded-md whitespace-pre-wrap break-words font-mono text-sm"><code>{debugCode}</code></pre>
                      </div>
                  )}
                  {renderResults()}
              </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa công cụ "${tool.name}" không? Hành động này không thể hoàn tác.`}
      />
    </>
  );
};

export default ToolDetailPage;