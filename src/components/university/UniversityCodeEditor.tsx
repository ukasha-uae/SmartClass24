/**
 * Sandboxed Code Editor Component
 * Integrated Monaco Editor with live preview and security measures
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Play, Save, RotateCcw, Download, Upload, FileCode, Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { CodeFile, CodeExecutionResult, ConsoleMessage, SandboxConfig } from '@/types/university';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading editor...</div>
});

interface UniversityCodeEditorProps {
  initialFiles: CodeFile[];
  environment: 'html-css-js' | 'react' | 'vue' | 'python' | 'nodejs' | 'typescript' | 'nextjs';
  sandboxConfig?: SandboxConfig;
  onExecute?: (result: CodeExecutionResult) => void;
  onSave?: (files: CodeFile[]) => void;
  readOnly?: boolean;
  showPreview?: boolean;
  showConsole?: boolean;
  height?: string;
  instructions?: string;
}

const DEFAULT_SANDBOX_CONFIG: SandboxConfig = {
  allowedDomains: [],
  allowedAPIs: ['console', 'setTimeout', 'setInterval', 'fetch'],
  maxExecutionTime: 5000,
  maxMemory: 128,
  enableNetwork: false,
  enableStorage: false,
  cspPolicy: "default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline';"
};

export default function UniversityCodeEditor({
  initialFiles,
  environment,
  sandboxConfig = DEFAULT_SANDBOX_CONFIG,
  onExecute,
  onSave,
  readOnly = false,
  showPreview = true,
  showConsole = true,
  height = '600px',
  instructions
}: UniversityCodeEditorProps) {
  const [files, setFiles] = useState<CodeFile[]>(initialFiles);
  const [activeFile, setActiveFile] = useState<CodeFile>(initialFiles[0] || { path: 'index.html', content: '', language: 'html' });
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [consoleVisible, setConsoleVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);

  // Update active file content
  const handleEditorChange = (value: string | undefined) => {
    if (!value || readOnly) return;
    
    const updatedFiles = files.map(file => 
      file.path === activeFile.path ? { ...file, content: value } : file
    );
    
    setFiles(updatedFiles);
    setActiveFile({ ...activeFile, content: value });
  };

  // Switch between files
  const switchFile = (file: CodeFile) => {
    setActiveFile(file);
  };

  // Create sandboxed HTML for preview
  const createSandboxedHTML = useCallback(() => {
    const htmlFile = files.find(f => f.path.endsWith('.html')) || files.find(f => f.language === 'html');
    const cssFile = files.find(f => f.path.endsWith('.css')) || files.find(f => f.language === 'css');
    const jsFile = files.find(f => f.path.endsWith('.js')) || files.find(f => f.language === 'javascript');

    const htmlContent = htmlFile?.content || '<div id="root"></div>';
    const cssContent = cssFile?.content || '';
    const jsContent = jsFile?.content || '';

    // Wrap JS in try-catch for error handling
    const wrappedJS = `
      (function() {
        const originalConsole = {
          log: console.log,
          warn: console.warn,
          error: console.error,
          info: console.info
        };

        window.addEventListener('error', function(e) {
          window.parent.postMessage({
            type: 'console',
            level: 'error',
            message: e.message,
            timestamp: Date.now()
          }, '*');
        });

        console.log = function(...args) {
          originalConsole.log.apply(console, args);
          window.parent.postMessage({
            type: 'console',
            level: 'log',
            message: args.join(' '),
            timestamp: Date.now()
          }, '*');
        };

        console.error = function(...args) {
          originalConsole.error.apply(console, args);
          window.parent.postMessage({
            type: 'console',
            level: 'error',
            message: args.join(' '),
            timestamp: Date.now()
          }, '*');
        };

        console.warn = function(...args) {
          originalConsole.warn.apply(console, args);
          window.parent.postMessage({
            type: 'console',
            level: 'warn',
            message: args.join(' '),
            timestamp: Date.now()
          }, '*');
        };

        try {
          ${jsContent}
        } catch (error) {
          console.error('Execution error:', error.message);
        }
      })();
    `;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="${sandboxConfig.cspPolicy}">
          <style>${cssContent}</style>
        </head>
        <body>
          ${htmlContent}
          <script>${wrappedJS}</script>
        </body>
      </html>
    `;
  }, [files, sandboxConfig]);

  // Execute code in sandboxed iframe
  const executeCode = useCallback(() => {
    setIsExecuting(true);
    setConsoleMessages([]);
    
    try {
      const sandboxedHTML = createSandboxedHTML();
      
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const blob = new Blob([sandboxedHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        iframe.src = url;
        
        const result: CodeExecutionResult = {
          success: true,
          output: 'Code executed successfully',
          console: [],
          preview: {
            html: sandboxedHTML,
            assets: {}
          }
        };
        
        setExecutionResult(result);
        onExecute?.(result);
      }
      
      setTimeout(() => setIsExecuting(false), 500);
    } catch (error: any) {
      const result: CodeExecutionResult = {
        success: false,
        error: error.message,
        console: [{
          type: 'error',
          message: error.message,
          timestamp: Date.now()
        }]
      };
      
      setExecutionResult(result);
      onExecute?.(result);
      setIsExecuting(false);
    }
  }, [files, createSandboxedHTML, onExecute]);

  // Listen to console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        const message: ConsoleMessage = {
          type: event.data.level,
          message: event.data.message,
          timestamp: event.data.timestamp
        };
        setConsoleMessages(prev => [...prev, message]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Auto-execute on file change (optional)
  useEffect(() => {
    if (environment === 'html-css-js' && showPreview && previewVisible) {
      const timer = setTimeout(executeCode, 1000);
      return () => clearTimeout(timer);
    }
  }, [files, environment, showPreview, previewVisible, executeCode]);

  // Cleanup Monaco Editor on unmount to prevent InstantiationService error
  useEffect(() => {
    return () => {
      if (editorRef.current && typeof editorRef.current.dispose === 'function') {
        try {
          // Only dispose if not already disposed
          if (!editorRef.current._isDisposed) {
            editorRef.current.dispose();
            editorRef.current = null;
          }
        } catch (error) {
          // Silently handle disposal errors
          console.debug('Editor cleanup error:', error);
        }
      }
    };
  }, []);

  const handleSave = () => {
    onSave?.(files);
    const message: ConsoleMessage = {
      type: 'info',
      message: 'Files saved successfully',
      timestamp: Date.now()
    };
    setConsoleMessages(prev => [...prev, message]);
  };

  const handleReset = () => {
    setFiles(initialFiles);
    setActiveFile(initialFiles[0]);
    setConsoleMessages([]);
    setExecutionResult(null);
  };

  const handleDownload = () => {
    files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.path;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className={`border rounded-lg overflow-hidden bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`} style={{ height: isFullscreen ? '100vh' : height }}>
      {/* Instructions Panel */}
      {instructions && (
        <div className="bg-blue-900/30 border-b border-blue-700/50 p-4 text-sm text-blue-100">
          <p className="font-medium mb-1">📝 Instructions:</p>
          <p>{instructions}</p>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* File Tabs */}
          {files.map(file => (
            <button
              key={file.path}
              onClick={() => switchFile(file)}
              className={`px-3 py-1.5 text-sm rounded flex items-center space-x-2 transition-colors ${
                activeFile.path === file.path
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>{file.path}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {!readOnly && (
            <>
              <button
                onClick={executeCode}
                disabled={isExecuting}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded flex items-center space-x-1 transition-colors disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                <span>Run</span>
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded flex items-center space-x-1 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded flex items-center space-x-1 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </>
          )}
          {showPreview && (
            <button
              onClick={() => setPreviewVisible(!previewVisible)}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded flex items-center space-x-1 transition-colors"
            >
              {previewVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded flex items-center space-x-1 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded flex items-center space-x-1 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex" style={{ height: 'calc(100% - 120px)' }}>
        {/* Code Editor */}
        <div className={`${showPreview && previewVisible ? 'w-1/2' : 'w-full'} border-r border-gray-700`}>
          <MonacoEditor
            height="100%"
            language={activeFile.language}
            value={activeFile.content}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              readOnly: readOnly || activeFile.readOnly,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              tabSize: 2,
            }}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
          />
        </div>

        {/* Preview Pane */}
        {showPreview && previewVisible && (
          <div className="w-1/2 bg-white flex flex-col">
            <div className="bg-gray-800 text-white text-xs px-3 py-2 border-b border-gray-700">
              Live Preview
            </div>
            <iframe
              ref={iframeRef}
              title="Code Preview"
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full border-0"
            />
          </div>
        )}
      </div>

      {/* Console Output */}
      {showConsole && consoleVisible && (
        <div className="bg-gray-950 border-t border-gray-700 p-3 overflow-y-auto" style={{ maxHeight: '150px' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-semibold">Console</span>
            <button
              onClick={() => setConsoleMessages([])}
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              Clear
            </button>
          </div>
          <div className="space-y-1 font-mono text-xs">
            {consoleMessages.length === 0 ? (
              <div className="text-gray-600">No console output</div>
            ) : (
              consoleMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`${
                    msg.type === 'error'
                      ? 'text-red-400'
                      : msg.type === 'warn'
                      ? 'text-yellow-400'
                      : msg.type === 'info'
                      ? 'text-blue-400'
                      : 'text-gray-300'
                  }`}
                >
                  <span className="text-gray-600">[{new Date(msg.timestamp).toLocaleTimeString()}]</span> {msg.message}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
