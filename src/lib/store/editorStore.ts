// Zustand 状态管理 - 代码编辑器状态
import { create } from 'zustand';

interface EditorState {
  html: string;
  css: string;
  js: string;
  
  // 编辑器设置
  theme: 'light' | 'dark';
  fontSize: number;
  autoSave: boolean;
  
  // UI 状态
  activeTab: 'html' | 'css' | 'js';
  isPreviewVisible: boolean;
  isConsoleVisible: boolean;
  
  // Console
  consoleMessages: Array<{
    type: 'log' | 'error' | 'warn' | 'info';
    message: string;
    timestamp: Date;
  }>;
  
  // Actions
  setHTML: (html: string) => void;
  setCSS: (css: string) => void;
  setJS: (js: string) => void;
  
  setAllCode: (code: { html: string; css: string; js: string }) => void;
  resetCode: () => void;
  
  setTheme: (theme: 'light' | 'dark') => void;
  setFontSize: (size: number) => void;
  setAutoSave: (enabled: boolean) => void;
  
  setActiveTab: (tab: 'html' | 'css' | 'js') => void;
  togglePreview: () => void;
  toggleConsole: () => void;
  
  addConsoleMessage: (type: 'log' | 'error' | 'warn' | 'info', message: string) => void;
  clearConsole: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  html: '',
  css: '',
  js: '',
  
  theme: 'dark',
  fontSize: 14,
  autoSave: true,
  
  activeTab: 'html',
  isPreviewVisible: true,
  isConsoleVisible: false,
  
  consoleMessages: [],
  
  setHTML: (html) => set({ html }),
  setCSS: (css) => set({ css }),
  setJS: (js) => set({ js }),
  
  setAllCode: (code) => set({
    html: code.html,
    css: code.css,
    js: code.js
  }),
  
  resetCode: () => set({
    html: '',
    css: '',
    js: ''
  }),
  
  setTheme: (theme) => set({ theme }),
  setFontSize: (fontSize) => set({ fontSize }),
  setAutoSave: (autoSave) => set({ autoSave }),
  
  setActiveTab: (activeTab) => set({ activeTab }),
  togglePreview: () => set((state) => ({ isPreviewVisible: !state.isPreviewVisible })),
  toggleConsole: () => set((state) => ({ isConsoleVisible: !state.isConsoleVisible })),
  
  addConsoleMessage: (type, message) => set((state) => ({
    consoleMessages: [
      ...state.consoleMessages,
      { type, message, timestamp: new Date() }
    ]
  })),
  
  clearConsole: () => set({ consoleMessages: [] })
}));

