// AI 助教组件
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, X } from 'lucide-react';
import { chatWithAI, type AIMessage } from '../../lib/ai/deepseek';
import { BRAND } from '../../lib/branding';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: 'assistant',
      content: `你好！我是${BRAND.aiAssistant}，专为${BRAND.shortName}同学提供 Web 编程辅导。无论是 HTML/CSS/JavaScript 还是校园项目（如新生欢迎页、社团活动页），都可以问我！ 😊`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: AIMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithAI(input, messages.filter((m) => m.role !== 'system'));
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.success ? response.message : '抱歉，我现在遇到了一些问题。请稍后再试。',
        },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: '抱歉，发生了错误。请稍后再试。' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex h-[600px] w-[400px] flex-col rounded-xl bg-white shadow-2xl">
      <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-r from-bistu-primary to-bistu-primary-dark px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <img src={BRAND.logo} alt="" className="h-6 w-6" />
          <h3 className="font-semibold text-sm">{BRAND.aiAssistant}</h3>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-bistu-primary text-white' : 'bg-gray-100 text-gray-900'}`}>
                {message.role === 'assistant' && (
                  <div className="mb-1 flex items-center gap-1 text-xs text-gray-500">
                    <Sparkles size={12} /><span>{BRAND.shortName} AI</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2">
                <Loader2 className="animate-spin text-bistu-primary" size={16} />
                <span className="text-sm text-gray-600">正在思考...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="输入编程问题..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-bistu-primary focus:outline-none"
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()} className="rounded-lg bg-bistu-primary px-4 py-2 text-white hover:bg-bistu-primary-light disabled:opacity-50">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
