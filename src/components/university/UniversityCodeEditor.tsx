/**
 * Sandboxed Code Editor Component
 * Integrated Monaco Editor with live preview, mobile-optimized views, and security measures
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { 
  Play, 
  Save, 
  RotateCcw, 
  Download, 
  FileCode, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Minimize2, 
  Code2, 
  Terminal, 
  Columns2, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Undo2,
  Redo2,
  CheckSquare,
  Indent,
  Trash2
} from 'lucide-react';
import { CodeFile, CodeExecutionResult, ConsoleMessage, SandboxConfig, ValidationRule } from '@/types/university';
import { runValidationRules, ValidationOutcome } from '@/lib/university-validation';
import { useFullscreen } from '@/contexts/FullscreenContext';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react').then(mod => mod.default ?? mod), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 p-4 text-center">
      <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs sm:text-sm">Loading code editor...</span>
    </div>
  )
});

type ViewMode = 'code' | 'preview' | 'split' | 'console';

interface UniversityCodeEditorProps {
  initialFiles: CodeFile[];
  environment: 'html-css-js' | 'react' | 'vue' | 'python' | 'nodejs' | 'typescript' | 'nextjs';
  sandboxConfig?: SandboxConfig;
  validationRules?: ValidationRule[];
  onExecute?: (result: CodeExecutionResult) => void;
  onValidate?: (results: ValidationOutcome[]) => void;
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
  validationRules,
  onExecute,
  onValidate,
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
  const [viewMode, setViewMode] = useState<ViewMode>('code');
  const [isMobile, setIsMobile] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasRunOnce, setHasRunOnce] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);
  const { setFullscreen: setGlobalFullscreen } = useFullscreen();

  const toggleFullscreen = () => {
    const next = !isFullscreen;
    setIsFullscreen(next);
    setGlobalFullscreen(next, { lockScroll: next });
  };

  // Detect mobile screen width on mount and resize
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    // Initial check
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (!mobile && showPreview) {
      setViewMode('split');
    } else {
      setViewMode('code');
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showPreview]);

  // Layout Monaco Editor when viewMode or fullscreen changes
  useEffect(() => {
    if (editorRef.current && typeof editorRef.current.layout === 'function') {
      const timer = setTimeout(() => {
        try {
          editorRef.current.layout();
        } catch (e) {
          // Silently ignore layout error
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [viewMode, isFullscreen, showInstructions]);

  // Update active file content
  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined || readOnly) return;
    
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
  const executeCode = useCallback((options?: { autoSwitchToPreview?: boolean }) => {
    setIsExecuting(true);
    setConsoleMessages([]);
    setHasRunOnce(true);
    
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
      
      // On phone / mobile or in single tab view, automatically jump to Preview
      if (options?.autoSwitchToPreview && showPreview) {
        setViewMode('preview');
      }
      
      setTimeout(() => setIsExecuting(false), 400);
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
  }, [files, createSandboxedHTML, onExecute, showPreview]);

  // Listen to console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'console') {
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

  // Auto-execute on file change in background for preview update.
  // Reads executeCode via a ref so an unmemoized onExecute/onSave prop from the
  // parent can't re-arm this timer every render and loop the preview forever.
  const executeCodeRef = useRef(executeCode);
  executeCodeRef.current = executeCode;

  useEffect(() => {
    if (environment === 'html-css-js' && showPreview) {
      const timer = setTimeout(() => {
        executeCodeRef.current({ autoSwitchToPreview: false });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [files, environment, showPreview]);

  // Re-grade checkpoint/project rules whenever code or console output changes
  useEffect(() => {
    if (!validationRules || validationRules.length === 0) return;
    const results = runValidationRules(validationRules, files, consoleMessages);
    onValidate?.(results);
  }, [files, consoleMessages, validationRules, onValidate]);

  // Cleanup Monaco Editor on unmount to prevent InstantiationService error
  useEffect(() => {
    return () => {
      if (editorRef.current && typeof editorRef.current.dispose === 'function') {
        try {
          if (!editorRef.current._isDisposed) {
            editorRef.current.dispose();
            editorRef.current = null;
          }
        } catch (error) {
          console.debug('Editor cleanup error:', error);
        }
      }
    };
  }, []);

  const handleSave = () => {
    onSave?.(files);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    const message: ConsoleMessage = {
      type: 'info',
      message: 'Files saved successfully',
      timestamp: Date.now()
    };
    setConsoleMessages(prev => [...prev, message]);
  };

  const handleReset = () => {
    if (window.confirm('Reset code to initial template? Any unsaved changes will be lost.')) {
      setFiles(initialFiles);
      setActiveFile(initialFiles[0]);
      setConsoleMessages([]);
      setExecutionResult(null);
    }
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

  // Helper functions for mobile touch & editing
  const insertTextAtCursor = (text: string) => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      if (selection) {
        const op = {
          range: selection,
          text: text,
          forceMoveMarkers: true
        };
        editorRef.current.executeEdits('quick-insert', [op]);
        editorRef.current.focus();
      }
    }
  };

  const handleSelectAll = () => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        editorRef.current.setSelection(model.getFullModelRange());
        editorRef.current.focus();
      }
    }
  };

  const handleSelectCurrentLine = () => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      if (position) {
        const model = editorRef.current.getModel();
        if (model) {
          const lineContent = model.getLineContent(position.lineNumber);
          editorRef.current.setSelection({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: lineContent.length + 1
          });
          editorRef.current.focus();
        }
      }
    }
  };

  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('mobile-toolbar', 'undo', null);
      editorRef.current.focus();
    }
  };

  const handleRedo = () => {
    if (editorRef.current) {
      editorRef.current.trigger('mobile-toolbar', 'redo', null);
      editorRef.current.focus();
    }
  };

  const handleClear = () => {
    if (editorRef.current && window.confirm('Clear all code in this file?')) {
      const model = editorRef.current.getModel();
      if (model) {
        editorRef.current.executeEdits('clear', [{
          range: model.getFullModelRange(),
          text: '',
          forceMoveMarkers: true
        }]);
        editorRef.current.focus();
      }
    }
  };

  // Re-indent/organize the whole file (fixes messy paste jobs)
  const handleFormatCode = () => {
    if (editorRef.current) {
      const formatAction = editorRef.current.getAction('editor.action.formatDocument');
      if (formatAction) {
        formatAction.run();
      }
      editorRef.current.focus();
    }
  };

  const QUICK_SYMBOLS = ['<', '>', '/', '=', '"', "'", '{', '}', '(', ')', ';', ':', '!', '$', '#', '.', ','];

  const errorCount = consoleMessages.filter(m => m.type === 'error').length;
  const isSplitActive = viewMode === 'split' && showPreview;

  if (!mounted) {
    return (
      <div 
        className="border border-gray-700/80 rounded-xl overflow-hidden bg-gray-900 shadow-2xl flex flex-col items-center justify-center p-8" 
        style={{ height: height || '600px', minHeight: '480px' }}
      >
        <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading code editor...</span>
        </div>
      </div>
    );
  }

  const isPurePreview = viewMode === 'preview';

  return (
    <div 
      className={`border border-gray-700/80 rounded-xl overflow-hidden bg-gray-900 shadow-2xl flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : ''
      }`} 
      style={{ height: isFullscreen ? '100vh' : (height || '600px'), minHeight: isPurePreview ? '520px' : '480px' }}
    >
      {/* 1. DEDICATED PREVIEW TOP BAR: Shown ONLY in Preview Mode (zero clutter, max view space) */}
      {isPurePreview ? (
        <div className="bg-gray-900 border-b border-gray-800 px-3 py-2 flex items-center justify-between shrink-0 h-11 select-none">
          {/* Back to Code Button */}
          <button
            onClick={() => setViewMode('code')}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Code</span>
          </button>

          {/* Live Status */}
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isExecuting ? 'bg-yellow-400 animate-ping' : 'bg-green-400'}`}></span>
            <span className="text-xs font-medium text-gray-200 hidden sm:inline">
              {isExecuting ? 'Updating...' : 'Live Preview'}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => executeCode({ autoSwitchToPreview: false })}
              className="p-1.5 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors active:scale-95"
              title="Refresh Preview"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin text-green-400' : ''}`} />
            </button>

            {showConsole && (
              <button
                onClick={() => setViewMode('console')}
                className="px-2 py-1 text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center space-x-1 transition-colors"
                title="Console Logs"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Console</span>
                {errorCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold">
                    {errorCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors active:scale-95"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 2. INSTRUCTIONS PANEL (Only in Code or Split mode, collapsible) */}
          {instructions && (
            <div className="bg-blue-950/70 border-b border-blue-800/50 text-blue-100 shrink-0">
              <div 
                onClick={() => setShowInstructions(!showInstructions)}
                className="flex items-center justify-between px-3 py-1.5 sm:px-4 sm:py-2 cursor-pointer hover:bg-blue-900/40 transition-colors select-none"
              >
                <div className="flex items-center space-x-2 min-w-0 pr-2">
                  <span className="font-semibold text-xs sm:text-sm text-blue-300 flex items-center gap-1.5 shrink-0">
                    📝 Instructions
                  </span>
                  {!showInstructions && (
                    <span className="text-xs text-blue-200/70 truncate">
                      {instructions}
                    </span>
                  )}
                </div>
                <button 
                  type="button" 
                  className="text-blue-300 hover:text-white text-xs flex items-center gap-1 shrink-0 font-medium px-1.5 py-0.5 rounded bg-blue-900/60 hover:bg-blue-800/80 transition-colors"
                >
                  <span>{showInstructions ? 'Hide' : 'Show'}</span>
                  {showInstructions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
              {showInstructions && (
                <div className="px-3 pb-3 pt-1 text-xs sm:text-sm border-t border-blue-900/50 whitespace-pre-wrap leading-relaxed text-blue-100/90 max-h-32 overflow-y-auto">
                  {instructions}
                </div>
              )}
            </div>
          )}

          {/* 3. PRIMARY TOOLBAR (Code / Split view) */}
          <div className="bg-gray-850 bg-gray-900 border-b border-gray-700/80 px-2 py-1.5 sm:px-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
            {/* Left: File Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar max-w-[55%] sm:max-w-[45%] py-0.5">
              {files.map(file => (
                <button
                  key={file.path}
                  onClick={() => switchFile(file)}
                  className={`px-2.5 py-1 text-xs rounded-lg flex items-center space-x-1.5 transition-all whitespace-nowrap shrink-0 border ${
                    activeFile.path === file.path
                      ? 'bg-gray-800 border-gray-600 text-white font-medium shadow-sm'
                      : 'bg-gray-900/60 border-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{file.path}</span>
                </button>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 ml-auto">
              {!readOnly && (
                <>
                  <button
                    onClick={() => executeCode({ autoSwitchToPreview: isMobile || viewMode === 'code' })}
                    disabled={isExecuting}
                    className="px-2.5 sm:px-3 py-1 bg-green-600 hover:bg-green-500 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-lg flex items-center space-x-1.5 shadow-sm transition-all disabled:opacity-50"
                    title="Run code and preview"
                  >
                    <Play className={`w-3.5 h-3.5 fill-current ${isExecuting ? 'animate-pulse' : ''}`} />
                    <span>{isMobile ? 'Run & View' : 'Run'}</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-2 sm:px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white text-xs rounded-lg flex items-center space-x-1 border border-gray-700 transition-colors"
                    title="Save files"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="hidden sm:inline text-green-400">Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Save</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    className="p-1 sm:px-2 py-1 bg-gray-800 hover:bg-gray-700 text-yellow-400 text-xs rounded-lg flex items-center space-x-1 border border-gray-700 transition-colors"
                    title="Reset to starter code"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </>
              )}

              {showPreview && (
                <button
                  onClick={() => {
                    setViewMode('preview');
                    if (!hasRunOnce) {
                      executeCode({ autoSwitchToPreview: false });
                    }
                  }}
                  className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs rounded-lg flex items-center space-x-1 border border-gray-700 transition-colors"
                  title="View Preview"
                >
                  <Eye className="w-3.5 h-3.5 text-green-400" />
                  <span className="hidden sm:inline">Preview</span>
                </button>
              )}

              {/* Split Mode - visible on desktop */}
              {showPreview && !isMobile && (
                <button
                  onClick={() => setViewMode(viewMode === 'split' ? 'code' : 'split')}
                  className={`px-2.5 py-1 text-xs rounded-lg flex items-center space-x-1 border transition-colors ${
                    viewMode === 'split' 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white'
                  }`}
                  title="Toggle Split View"
                >
                  <Columns2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Split</span>
                </button>
              )}

              {showConsole && (
                <button
                  onClick={() => setViewMode(viewMode === 'console' ? (isMobile ? 'code' : 'split') : 'console')}
                  className={`px-2 py-1 text-xs rounded-lg flex items-center space-x-1 border transition-colors ${
                    viewMode === 'console' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200'
                  }`}
                  title="Console"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  {consoleMessages.length > 0 && (
                    <span className={`px-1 rounded-full text-[9px] font-bold ${
                      errorCount > 0 ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {consoleMessages.length}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={handleDownload}
                className="p-1 sm:px-2 sm:py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs rounded-lg flex items-center space-x-1 border border-gray-700 transition-colors"
                title="Download code files"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1 sm:px-2 sm:py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs rounded-lg flex items-center space-x-1 border border-gray-700 transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row relative overflow-hidden">
        {/* Code Editor Pane */}
        <div 
          className={`h-full flex flex-col transition-all duration-150 ${
            viewMode === 'code' 
              ? 'w-full block' 
              : viewMode === 'split' 
              ? 'w-full md:w-1/2 block border-r border-gray-700/80' 
              : 'hidden'
          }`}
        >
          {/* Mobile Touch Assistant & Symbol Bar */}
          <div className="bg-gray-950 border-b border-gray-800 px-2 py-1 flex items-center space-x-1.5 overflow-x-auto no-scrollbar shrink-0 select-none">
            {/* Quick Actions */}
            <div className="flex items-center space-x-1 border-r border-gray-800 pr-1.5 shrink-0">
              <button
                type="button"
                onClick={handleUndo}
                className="p-1 rounded text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-800 active:scale-90 transition-transform"
                title="Undo"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                className="p-1 rounded text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-800 active:scale-90 transition-transform"
                title="Redo"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-1.5 py-0.5 rounded text-[11px] font-medium text-blue-300 hover:text-blue-200 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 active:scale-95 transition-transform whitespace-nowrap"
                title="Select All Code"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleSelectCurrentLine}
                className="px-1.5 py-0.5 rounded text-[11px] font-medium text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-800 active:scale-95 transition-transform whitespace-nowrap"
                title="Select Current Line"
              >
                Select Line
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor('  ')}
                className="px-1.5 py-0.5 rounded text-[11px] font-mono text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-800 active:scale-95 transition-transform whitespace-nowrap flex items-center gap-1"
                title="Indent 2 spaces"
              >
                <Indent className="w-3 h-3" />
                <span>Tab</span>
              </button>
              <button
                type="button"
                onClick={handleFormatCode}
                className="px-1.5 py-0.5 rounded text-[11px] font-medium text-purple-300 hover:text-purple-200 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/60 active:scale-95 transition-transform whitespace-nowrap flex items-center gap-1"
                title="Auto-format / organize code"
              >
                <Sparkles className="w-3 h-3" />
                <span>Format</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded text-red-400 hover:text-red-300 bg-gray-900 hover:bg-gray-800 border border-gray-800 active:scale-90 transition-transform"
                title="Clear Code"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Quick Symbol Chips */}
            <div className="flex items-center space-x-1 shrink-0">
              {QUICK_SYMBOLS.map((sym, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => insertTextAtCursor(sym)}
                  className="px-2 py-0.5 rounded bg-gray-900 hover:bg-gray-800 hover:text-white text-gray-300 font-mono text-xs border border-gray-800 active:bg-blue-600 active:text-white active:scale-90 transition-all select-none shrink-0 min-w-[24px] text-center"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0 relative">
            <MonacoEditor
              height="100%"
              language={activeFile.language}
              value={activeFile.content}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: !isMobile },
                fontSize: isMobile ? 14 : 14,
                lineNumbers: 'on',
                lineNumbersMinChars: 3,
                readOnly: readOnly || activeFile.readOnly,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: 2,
                folding: !isMobile,
                glyphMargin: false,
                overviewRulerLanes: 0,
                renderLineHighlight: 'all',
                padding: { top: 8, bottom: 8 },
                // Touch & mobile selection enhancements:
                contextmenu: false, // Disables desktop contextmenu ("Rename symbol F2", "Go to symbol") on long press
                quickSuggestions: false, // Prevents popup dropdown from blocking touch keyboard
                suggestOnTriggerCharacters: false,
                acceptSuggestionOnEnter: 'off',
                dragAndDrop: false, // Prevents drag-and-drop from conflicting with touch text selection
                links: false,
                cursorWidth: 3,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                selectionHighlight: true,
                selectOnLineNumbers: true,
                // Auto-organize indentation when code is pasted or typed in
                formatOnPaste: true,
                formatOnType: true,
                autoIndent: 'full'
              }}
              onMount={(editor) => {
                editorRef.current = editor;
                const domNode = editor.getDomNode();
                if (domNode) {
                  domNode.addEventListener('contextmenu', (e: MouseEvent) => {
                    // Prevent any desktop contextmenu from intercepting touch selection
                    e.preventDefault();
                  });
                }
                // Re-format immediately after any paste so scattered/mis-indented code snaps into shape
                editor.onDidPaste(() => {
                  const formatAction = editor.getAction('editor.action.formatDocument');
                  if (formatAction) {
                    formatAction.run();
                  }
                });
              }}
            />

            {/* Floating Action for Mobile Phone in Code View */}
            {isMobile && viewMode === 'code' && showPreview && (
              <div className="absolute bottom-3 right-3 z-10">
                <button
                  onClick={() => executeCode({ autoSwitchToPreview: true })}
                  className="px-3.5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center space-x-1.5 active:scale-95 transition-all border border-green-400/40"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run & Preview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Pane */}
        {showPreview && (
          <div 
            className={`bg-white flex flex-col h-full transition-all duration-150 ${
              viewMode === 'preview' 
                ? 'w-full block' 
                : viewMode === 'split' 
                ? 'w-full md:w-1/2 block' 
                : 'hidden'
            }`}
          >
            {/* Split View Preview Header (only shown in side-by-side desktop view) */}
            {viewMode === 'split' && (
              <div className="bg-gray-800 text-gray-200 text-xs px-3 py-1.5 border-b border-gray-700 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="font-semibold text-gray-200">Live Preview</span>
                  {isExecuting && <span className="text-[10px] text-green-400 animate-pulse">Updating...</span>}
                </div>
                <button
                  onClick={() => executeCode({ autoSwitchToPreview: false })}
                  className="p-1 hover:bg-gray-700 text-gray-300 hover:text-white rounded transition-colors"
                  title="Refresh Preview"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin text-green-400' : ''}`} />
                </button>
              </div>
            )}

            {/* Iframe Viewport */}
            <div className="flex-1 min-h-0 bg-white relative w-full h-full">
              <iframe
                ref={iframeRef}
                title="Code Preview"
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full border-0 absolute inset-0"
              />
            </div>
          </div>
        )}

        {/* Full Console Pane (when Console mode is active) */}
        {showConsole && viewMode === 'console' && (
          <div className="w-full h-full bg-gray-950 flex flex-col">
            <div className="bg-gray-900 border-b border-gray-800 px-3 py-2 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-300">Console Logs & Diagnostics</span>
                {errorCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-900/60 text-red-300 border border-red-700/50">
                    {errorCount} {errorCount === 1 ? 'error' : 'errors'}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setConsoleMessages([])}
                  className="text-xs text-gray-400 hover:text-gray-200 px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Clear Logs
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-0.5 rounded bg-blue-900/30 transition-colors"
                >
                  Back to Code
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 p-3 overflow-y-auto font-mono text-xs space-y-1.5 bg-gray-950">
              {consoleMessages.length === 0 ? (
                <div className="text-gray-600 italic py-4 text-center">
                  No console messages yet. Run your code to view logs and errors here.
                </div>
              ) : (
                consoleMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-1.5 rounded flex items-start space-x-2 ${
                      msg.type === 'error'
                        ? 'bg-red-950/40 text-red-300 border-l-2 border-red-500'
                        : msg.type === 'warn'
                        ? 'bg-yellow-950/40 text-yellow-300 border-l-2 border-yellow-500'
                        : msg.type === 'info'
                        ? 'bg-blue-950/40 text-blue-300 border-l-2 border-blue-500'
                        : 'bg-gray-900/40 text-gray-300 border-l-2 border-gray-600'
                    }`}
                  >
                    <span className="text-gray-500 text-[10px] shrink-0 select-none">
                      [{new Date(msg.timestamp).toLocaleTimeString()}]
                    </span>
                    <span className="break-all whitespace-pre-wrap">{msg.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Inline Console Drawer for Split View mode */}
      {showConsole && viewMode === 'split' && consoleMessages.length > 0 && (
        <div className="bg-gray-950 border-t border-gray-800 p-2 shrink-0 max-h-24 overflow-y-auto">
          <div className="flex items-center justify-between mb-1 text-[11px] text-gray-400">
            <span className="font-semibold flex items-center gap-1">
              <Terminal className="w-3 h-3" /> Console
            </span>
            <button
              onClick={() => setConsoleMessages([])}
              className="hover:text-gray-200"
            >
              Clear
            </button>
          </div>
          <div className="space-y-1 font-mono text-xs">
            {consoleMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`truncate ${
                  msg.type === 'error'
                    ? 'text-red-400'
                    : msg.type === 'warn'
                    ? 'text-yellow-400'
                    : msg.type === 'info'
                    ? 'text-blue-400'
                    : 'text-gray-300'
                }`}
              >
                <span className="text-gray-600 text-[10px]">[{new Date(msg.timestamp).toLocaleTimeString()}]</span> {msg.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
