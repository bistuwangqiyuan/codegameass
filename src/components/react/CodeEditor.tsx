// 在线代码编辑器组件
import { useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
// Simplified: removed language extensions
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { useEditorStore } from '../../lib/store/editorStore';
import { Play, Save, RotateCcw, Eye, EyeOff, Terminal, X } from 'lucide-react';

interface CodeEditorProps {
  challengeId?: string;
  onSave?: (code: { html: string; css: string; js: string }) => void;
  onRun?: () => void;
}

export default function CodeEditor({ challengeId, onSave, onRun }: CodeEditorProps) {
  const {
    html,
    css,
    js,
    setHTML,
    setCSS,
    setJS,
    activeTab,
    setActiveTab,
    isPreviewVisible,
    togglePreview,
    isConsoleVisible,
    toggleConsole,
    consoleMessages,
    clearConsole,
    theme
  } = useEditorStore();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 实时预览
  useEffect(() => {
    if (!iframeRef.current || !isPreviewVisible) return;

    const iframe = iframeRef.current;
    const document = iframe.contentDocument;
    if (!document) return;

    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            // 捕获控制台输出
            (function() {
              const originalLog = console.log;
              const originalError = console.error;
              const originalWarn = console.warn;

              console.log = function(...args) {
                window.parent.postMessage({ type: 'console', level: 'log', message: args.join(' ') }, '*');
                originalLog.apply(console, args);
              };

              console.error = function(...args) {
                window.parent.postMessage({ type: 'console', level: 'error', message: args.join(' ') }, '*');
                originalError.apply(console, args);
              };

              console.warn = function(...args) {
                window.parent.postMessage({ type: 'console', level: 'warn', message: args.join(' ') }, '*');
                originalWarn.apply(console, args);
              };

              // 捕获运行时错误
              window.onerror = function(msg, source, line, col, error) {
                window.parent.postMessage({ 
                  type: 'console', 
                  level: 'error', 
                  message: \`错误: \${msg} (行 \${line})\`
                }, '*');
                return false;
              };
            })();

            ${js}
          </script>
        </body>
      </html>
    `;

    document.open();
    document.write(fullHTML);
    document.close();
  }, [html, css, js, isPreviewVisible]);

  const handleSave = () => {
    if (onSave) {
      onSave({ html, css, js });
    }
  };

  const handleRun = () => {
    if (onRun) {
      onRun();
    }
    // 强制刷新预览
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.src = 'about:blank';
      setTimeout(() => {
        // 触发 useEffect 重新渲染
      }, 50);
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置代码吗？此操作无法撤销。')) {
      setHTML('');
      setCSS('');
      setJS('');
    }
  };

  const getLanguageExtension = () => {
    // Simplified: only JS syntax highlighting for now
    if (activeTab === 'js') {
      return [javascript()];
    }
    return [];
  };

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html':
        return html;
      case 'css':
        return css;
      case 'js':
        return js;
      default:
        return '';
    }
  };

  const setCurrentCode = (value: string) => {
    switch (activeTab) {
      case 'html':
        setHTML(value);
        break;
      case 'css':
        setCSS(value);
        break;
      case 'js':
        setJS(value);
        break;
    }
  };

  return (
    <div className="flex h-full flex-col bg-gray-900">
      {/* 工具栏 */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('html')}
            className={`rounded px-3 py-1.5 text-sm font-medium transition ${
              activeTab === 'html'
                ? 'bg-orange-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`rounded px-3 py-1.5 text-sm font-medium transition ${
              activeTab === 'css'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            CSS
          </button>
          <button
            onClick={() => setActiveTab('js')}
            className={`rounded px-3 py-1.5 text-sm font-medium transition ${
              activeTab === 'js'
                ? 'bg-yellow-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            JavaScript
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            className="flex items-center gap-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-green-700"
          >
            <Play size={16} />
            运行
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Save size={16} />
            保存
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded bg-gray-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-600"
          >
            <RotateCcw size={16} />
            重置
          </button>
          <button
            onClick={togglePreview}
            className="flex items-center gap-2 rounded bg-gray-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-600"
          >
            {isPreviewVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            onClick={toggleConsole}
            className="flex items-center gap-2 rounded bg-gray-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-gray-600"
          >
            <Terminal size={16} />
          </button>
        </div>
      </div>

      {/* 编辑器和预览区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 代码编辑器 */}
        <div className="flex-1 overflow-auto">
          <CodeMirror
            value={getCurrentCode()}
            height="100%"
            theme={oneDark}
            extensions={getLanguageExtension()}
            onChange={(value) => setCurrentCode(value)}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              foldGutter: true,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              searchKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
          />
        </div>

        {/* 预览窗口 */}
        {isPreviewVisible && (
          <div className="flex w-1/2 flex-col border-l border-gray-700 bg-white">
            <div className="border-b border-gray-300 bg-gray-100 px-4 py-2">
              <h3 className="text-sm font-medium text-gray-700">预览</h3>
            </div>
            <iframe
              ref={iframeRef}
              className="h-full w-full"
              title="preview"
              sandbox="allow-scripts"
            />
          </div>
        )}
      </div>

      {/* 控制台 */}
      {isConsoleVisible && (
        <div className="h-48 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
            <h3 className="text-sm font-medium text-gray-300">控制台</h3>
            <div className="flex gap-2">
              <button
                onClick={clearConsole}
                className="text-xs text-gray-400 hover:text-white"
              >
                清空
              </button>
              <button
                onClick={toggleConsole}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="h-full overflow-auto p-2">
            {consoleMessages.map((msg, index) => (
              <div
                key={index}
                className={`mb-1 font-mono text-xs ${
                  msg.type === 'error'
                    ? 'text-red-400'
                    : msg.type === 'warn'
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              >
                [{msg.timestamp.toLocaleTimeString()}] {msg.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

