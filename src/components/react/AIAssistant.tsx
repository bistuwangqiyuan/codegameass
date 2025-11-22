// AI 助教组件
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, X } from 'lucide-react';
import { chatWithAI, type AIMessage } from '../../lib/ai/deepseek';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: 'assistant',
      content: '你好！我是 CodeMentor DS，你的 AI 编程助教。有什么编程问题需要我帮助吗？ 😊'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: AIMessage = {
      role: 'user',
      content: input
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithAI(
        input,
        messages.filter((m) => m.role !== 'system')
      );

      if (response.success) {
        const aiMessage: AIMessage = {
          role: 'assistant',
          content: response.message
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage: AIMessage = {
          role: 'assistant',
          content: '抱歉，我现在遇到了一些问题。请稍后再试。'
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage: AIMessage = {
        role: 'assistant',
        content: '抱歉，发生了错误。请稍后再试。'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex h-[600px] w-[400px] flex-col rounded-xl bg-white shadow-2xl">
      {/* 头部 */}
      <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Sparkles size={20} />
          <h3 className="font-semibold">CodeMentor DS</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="mb-1 flex items-center gap-1 text-xs text-gray-500">
                    <Sparkles size={12} />
                    <span>AI 助教</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2">
                <Loader2 className="animate-spin text-blue-500" size={16} />
                <span className="text-sm text-gray-600">正在思考...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入框 */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入你的问题..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          按 Enter 发送，Shift + Enter 换行
        </p>
      </div>
    </div>
  );
}

