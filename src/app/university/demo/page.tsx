/**
 * S24 Innovation Academy Demo Page
 * Try the code editor without signing in
 */

'use client';

import UniversityCodeEditor from '@/components/university/UniversityCodeEditor';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { CodeFile } from '@/types/university';
import { useTenantLink } from '@/hooks/useTenantLink';

const demoFiles: CodeFile[] = [
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

export default function UniversityDemoPage() {
  const addTenantParam = useTenantLink();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Under Construction Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 text-center text-sm font-medium">
        🚧 Demo Preview - Full platform under active development
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Link
            href={addTenantParam('/university')}
            className="inline-flex items-center text-green-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to S24 Innovation Academy
          </Link>
          <div className="flex items-center space-x-3 mb-3">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Try the Code Editor</h1>
          </div>
          <p className="text-green-100 text-lg">
            Experience our integrated code editor with a live demo project. Edit the code and see your changes instantly!
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
          <h2 className="text-xl font-bold text-blue-900 mb-3">🎯 Demo Instructions</h2>
          <ul className="space-y-2 text-blue-800">
            <li>✅ <strong>Edit the code</strong> in any file (HTML, CSS, or JavaScript)</li>
            <li>✅ <strong>See live preview</strong> update automatically in the right panel</li>
            <li>✅ <strong>Check the console</strong> at the bottom for JavaScript output</li>
            <li>✅ <strong>Click "Change Color"</strong> button in the preview to test JavaScript</li>
            <li>✅ <strong>Try different colors</strong> in the CSS file</li>
            <li>✅ <strong>Download your work</strong> using the download button</li>
            <li>✅ <strong>No sign-in required</strong> - this is a free demo!</li>
          </ul>
        </div>

        {/* Code Editor */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <UniversityCodeEditor
            initialFiles={demoFiles}
            environment="html-css-js"
            showPreview={true}
            showConsole={true}
            height="700px"
            instructions="Try editing the HTML, CSS, or JavaScript and watch the preview update in real-time!"
          />
        </div>

        {/* Features Highlight */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-3">💻</div>
            <h3 className="font-bold text-gray-900 mb-2">Monaco Editor</h3>
            <p className="text-gray-600 text-sm">
              Same editor used in VS Code with syntax highlighting and auto-completion
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-bold text-gray-900 mb-2">Safe Sandbox</h3>
            <p className="text-gray-600 text-sm">
              Your code runs in a secure sandboxed environment for safety
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-900 mb-2">Instant Preview</h3>
            <p className="text-gray-600 text-sm">
              See your changes live as you type - no manual refresh needed
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Join S24 Innovation Academy and access complete courses with projects, certificates, and career support.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/university"
              className="px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Browse Programs
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors border-2 border-white/30"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
