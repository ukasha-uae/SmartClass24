/**
 * S24 Innovation Academy Demo Page
 * Try the code editor without signing in, or test code snippets directly from lessons
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Sparkles, RotateCcw, Check, Play, Code2 } from 'lucide-react';
import { CodeFile } from '@/types/university';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useTenant } from '@/hooks/useTenant';
import { useFullscreen } from '@/contexts/FullscreenContext';

const UniversityCodeEditor = dynamic(() => import('@/components/university/UniversityCodeEditor').then(mod => mod.default ?? mod), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-[600px] bg-gray-900 rounded-xl text-gray-400 gap-3">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">Loading code playground...</span>
    </div>
  )
});

const defaultDemoFiles: CodeFile[] = [
  {
    path: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Web Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Welcome to My Website!</h1>
    <p>Built with HTML, CSS, and JavaScript</p>
  </header>
  
  <main>
    <section class="card">
      <h2>About Me</h2>
      <p>I'm learning web development on SmartClass24 Innovation Academy!</p>
      <button onclick="changeColor()">Change Color</button>
    </section>
    
    <section class="card">
      <h2>My Skills</h2>
      <ul>
        <li>HTML5</li>
        <li>CSS3</li>
        <li>JavaScript</li>
      </ul>
    </section>
  </main>
  
  <footer>
    <p>&copy; 2026 SmartClass24 Innovation Academy</p>
  </footer>
  
  <script src="script.js"></script>
</body>
</html>`
  },
  {
    path: 'styles.css',
    language: 'css',
    content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
  color: #333;
}

header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
  animation: fadeIn 1s ease-in;
}

header h1 {
  font-size: 3rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

main {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.3);
}

.card h2 {
  color: #667eea;
  margin-bottom: 15px;
}

.card ul {
  list-style: none;
  padding-left: 0;
}

.card li {
  padding: 10px;
  margin: 5px 0;
  background: #f0f0f0;
  border-radius: 5px;
  transition: background 0.3s ease;
}

.card li:hover {
  background: #e0e0e0;
}

button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

button:active {
  transform: scale(0.95);
}

footer {
  text-align: center;
  color: white;
  margin-top: 40px;
  opacity: 0.8;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  header h1 {
    font-size: 2rem;
  }
  
  main {
    grid-template-columns: 1fr;
  }
}`
  },
  {
    path: 'script.js',
    language: 'javascript',
    content: `// JavaScript for interactive features
console.log('Welcome to SmartClass24 Innovation Academy! 🎓');

// Color change functionality
let colorIndex = 0;
const colors = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
];

function changeColor() {
  colorIndex = (colorIndex + 1) % colors.length;
  document.body.style.background = colors[colorIndex];
  console.log('Background color changed! 🎨');
  
  // Show success message
  showNotification('Color changed successfully!');
}

// Notification system
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = \`
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    color: #667eea;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    font-weight: bold;
    animation: slideIn 0.3s ease;
    z-index: 1000;
  \`;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = \`
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
\`;
document.head.appendChild(style);

// Welcome message
setTimeout(() => {
  console.log('🚀 Try clicking the "Change Color" button!');
  console.log('✨ Feel free to edit the code and see your changes live!');
}, 1000);`
  }
];

function UniversityDemoContent() {
  const addTenantParam = useTenantLink();
  const { academyDisplayName } = useTenant();
  const { setFullscreen } = useFullscreen();
  const searchParams = useSearchParams();
  const [currentFiles, setCurrentFiles] = useState<CodeFile[]>(defaultDemoFiles);
  const [editorKey, setEditorKey] = useState<number>(0);
  const [loadedSnippet, setLoadedSnippet] = useState<{ title: string; originUrl?: string } | null>(null);

  // Hide header, footer, and bottom navigation to provide distraction-free playground space
  useEffect(() => {
    setFullscreen(true, { lockScroll: false });
    return () => setFullscreen(false);
  }, [setFullscreen]);

  // Check if a snippet was passed via sessionStorage or query params
  useEffect(() => {
    let snippetData: { code: string; language?: string; title?: string; originUrl?: string } | null = null;

    try {
      const stored = sessionStorage.getItem('smartclass_playground_snippet');
      if (stored) {
        snippetData = JSON.parse(stored);
        sessionStorage.removeItem('smartclass_playground_snippet');
      }
    } catch (e) {
      console.warn('Could not parse sessionStorage snippet', e);
    }

    // Fallback to URL query params
    if (!snippetData) {
      const codeParam = searchParams.get('code');
      if (codeParam) {
        snippetData = {
          code: codeParam,
          language: searchParams.get('lang') || 'html',
          title: searchParams.get('title') || 'Lesson Snippet',
          originUrl: searchParams.get('from') || undefined
        };
      }
    }

    if (snippetData && snippetData.code) {
      const lang = (snippetData.language || 'html').toLowerCase();
      let newFiles: CodeFile[] = [];

      if (lang === 'css') {
        newFiles = [
          {
            path: 'styles.css',
            language: 'css',
            content: snippetData.code
          },
          {
            path: 'index.html',
            language: 'html',
            content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>CSS Styling Preview 🎨</h1>
    <p>Your CSS code is actively applied to this page!</p>
    <button class="btn">Test Button</button>
  </div>
</body>
</html>`
          },
          {
            path: 'script.js',
            language: 'javascript',
            content: `console.log('CSS Playground active! 🎨');`
          }
        ];
      } else if (lang === 'javascript' || lang === 'js') {
        newFiles = [
          {
            path: 'script.js',
            language: 'javascript',
            content: snippetData.code
          },
          {
            path: 'index.html',
            language: 'html',
            content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>JavaScript Test Page ⚡</h1>
  <p>Check the console below to see your script output.</p>
  <button onclick="runSnippet()">Run Function</button>
  <div id="output" style="margin-top: 15px; padding: 10px; background: #f0f4f8; border-radius: 8px;">Output appears here</div>
  <script src="script.js"></script>
</body>
</html>`
          },
          {
            path: 'styles.css',
            language: 'css',
            content: `body { font-family: sans-serif; padding: 20px; line-height: 1.6; }\nbutton { padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; }`
          }
        ];
      } else {
        // HTML snippet
        let htmlContent = snippetData.code;
        if (!htmlContent.includes('<html') && !htmlContent.includes('<!DOCTYPE')) {
          htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Preview</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${htmlContent}
  <script src="script.js"></script>
</body>
</html>`;
        }
        newFiles = [
          {
            path: 'index.html',
            language: 'html',
            content: htmlContent
          },
          {
            path: 'styles.css',
            language: 'css',
            content: `body {\n  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;\n  padding: 20px;\n  line-height: 1.6;\n  color: #1e293b;\n}`
          },
          {
            path: 'script.js',
            language: 'javascript',
            content: `console.log('HTML preview initialized! 👋');`
          }
        ];
      }

      setCurrentFiles(newFiles);
      setEditorKey(prev => prev + 1);
      setLoadedSnippet({
        title: snippetData.title || 'Code Example',
        originUrl: snippetData.originUrl
      });
    }
  }, [searchParams]);

  const handleResetToDefault = () => {
    setCurrentFiles(defaultDemoFiles);
    setEditorKey(prev => prev + 1);
    setLoadedSnippet(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Under Construction Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 text-center text-sm font-medium px-2">
        🚧 Playground & Code Editor — Test, Edit, and Run Code Safely
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <Link
            href={addTenantParam('/university')}
            className="inline-flex items-center text-green-100 hover:text-white mb-3 sm:mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to {academyDisplayName}
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-300" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Code Playground</h1>
          </div>
          <p className="text-green-100 text-sm sm:text-base max-w-2xl">
            Experiment with code in a sandboxed live environment. Edit HTML, CSS, or JavaScript and test your ideas instantly.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Loaded Snippet Notification Banner */}
        {loadedSnippet && (
          <div className="bg-gradient-to-r from-emerald-700 to-green-700 text-white p-3 sm:p-4 rounded-xl shadow-md mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3 border border-emerald-500/40">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="p-2 bg-white/20 rounded-lg shrink-0">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm sm:text-base truncate">✨ Loaded Code Snippet</p>
                <p className="text-xs sm:text-sm text-green-100 truncate">{loadedSnippet.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              {loadedSnippet.originUrl && (
                <Link
                  href={loadedSnippet.originUrl}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Lesson</span>
                </Link>
              )}
              <button
                onClick={handleResetToDefault}
                className="px-3 py-1.5 bg-white text-green-800 hover:bg-green-50 text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>
        )}

        {/* Instructions Card (only show if not preloaded with snippet, or minimized) */}
        {!loadedSnippet && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-5 mb-4 sm:mb-6 rounded-r-xl">
            <h2 className="text-base sm:text-lg font-bold text-blue-900 mb-2">🎯 Playground Tips</h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-blue-800">
              <li>✅ <strong>Edit the code</strong> in any file (HTML, CSS, or JavaScript)</li>
              <li>✅ <strong>Mobile Friendly:</strong> Switch between Code, Preview & Console tabs</li>
              <li>✅ <strong>See live preview</strong> update automatically in the preview panel</li>
              <li>✅ <strong>Check console</strong> for JavaScript logs and errors</li>
            </ul>
          </div>
        )}

        {/* Code Editor */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <UniversityCodeEditor
            key={editorKey}
            initialFiles={currentFiles}
            environment="html-css-js"
            showPreview={true}
            showConsole={true}
            height="700px"
            instructions={loadedSnippet ? `Testing code snippet: ${loadedSnippet.title}` : "Try editing the HTML, CSS, or JavaScript and watch the preview update in real-time!"}
          />
        </div>

        {/* Features Highlight */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-xl shadow-md text-center border border-gray-100">
            <div className="text-3xl sm:text-4xl mb-2">💻</div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Monaco Code Editor</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Same editor used in VS Code with syntax highlighting, line numbers and auto-completion.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md text-center border border-gray-100">
            <div className="text-3xl sm:text-4xl mb-2">📱</div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Phone & Desktop Ready</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Enjoy dedicated full-width Code & Preview tabs on mobile or side-by-side split view on desktop.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md text-center border border-gray-100">
            <div className="text-3xl sm:text-4xl mb-2">🔒</div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Safe Sandboxed Run</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Code runs safely inside a secure sandboxed environment with instant feedback.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 sm:p-8 text-center text-white shadow-lg">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-green-100 mb-4 sm:mb-6 max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
            Join {academyDisplayName} and access complete courses with projects, certificates, and hands-on coding labs.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={addTenantParam('/university')}
              className="px-6 py-3 bg-white text-green-700 rounded-xl font-bold hover:bg-green-50 transition-colors text-sm"
            >
              Browse Programs
            </Link>
            <Link
              href={addTenantParam('/signup')}
              className="px-6 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition-colors border border-white/30 text-sm"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UniversityDemoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    }>
      <UniversityDemoContent />
    </Suspense>
  );
}
