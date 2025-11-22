// DeepSeek AI 助教服务
// 提供代码讲解、纠错、生成任务等功能

const DEEPSEEK_API_KEY = import.meta.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 备用 AI API 配置
const FALLBACK_APIs = [
  {
    name: 'GLM',
    key: import.meta.env.GLM_API_KEY,
    url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
  },
  {
    name: 'Moonshot',
    key: import.meta.env.MOONSHOT_API_KEY,
    url: 'https://api.moonshot.cn/v1/chat/completions'
  }
];

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  model?: string;
}

/**
 * 调用 DeepSeek AI API
 */
async function callDeepSeek(messages: AIMessage[], temperature = 0.7): Promise<AIResponse> {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.choices[0].message.content,
      data,
      model: 'deepseek'
    };
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return {
      success: false,
      message: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 尝试使用备用 AI API
 */
async function callFallbackAI(messages: AIMessage[]): Promise<AIResponse> {
  for (const api of FALLBACK_APIs) {
    if (!api.key) continue;
    
    try {
      const response = await fetch(api.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api.key}`
        },
        body: JSON.stringify({
          model: api.name === 'GLM' ? 'glm-4' : 'moonshot-v1-8k',
          messages,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: data.choices[0].message.content,
          model: api.name.toLowerCase()
        };
      }
    } catch (error) {
      console.error(`${api.name} API error:`, error);
      continue;
    }
  }

  return {
    success: false,
    message: '',
    error: 'All AI APIs failed'
  };
}

/**
 * 主 AI 调用函数（带自动降级）
 */
export async function callAI(messages: AIMessage[], temperature = 0.7): Promise<AIResponse> {
  // 首先尝试 DeepSeek
  const deepseekResponse = await callDeepSeek(messages, temperature);
  
  if (deepseekResponse.success) {
    return deepseekResponse;
  }

  // 如果 DeepSeek 失败，尝试备用 API
  console.warn('DeepSeek failed, trying fallback APIs...');
  return await callFallbackAI(messages);
}

/**
 * AI 代码评估
 */
export async function evaluateCode(
  code: { html: string; css: string; js: string },
  challenge: { title: string; description: string; instructions: string }
): Promise<AIResponse> {
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `你是 CodeMentor DS，一个专业的编程教育 AI 助教。你需要评估学生提交的代码，给出友好、建设性的反馈。
      
评估标准：
1. 代码是否完成了任务要求
2. 代码质量（可读性、结构）
3. 最佳实践（语义化 HTML、CSS 组织、JS 规范）
4. 潜在的改进建议

请用简洁、友好的中文回复，包含：
- 整体评价（1-5星）
- 做得好的地方（2-3点）
- 可以改进的地方（2-3点）
- 具体的代码建议`
    },
    {
      role: 'user',
      content: `挑战：${challenge.title}
      
要求：${challenge.instructions}

学生提交的代码：

HTML:
\`\`\`html
${code.html}
\`\`\`

CSS:
\`\`\`css
${code.css}
\`\`\`

JavaScript:
\`\`\`javascript
${code.js}
\`\`\`

请评估这段代码。`
    }
  ];

  return await callAI(messages, 0.7);
}

/**
 * AI 代码讲解
 */
export async function explainCode(code: string, language: 'html' | 'css' | 'javascript'): Promise<AIResponse> {
  const languageNames = {
    html: 'HTML',
    css: 'CSS',
    javascript: 'JavaScript'
  };

  const messages: AIMessage[] = [
    {
      role: 'system',
      content: '你是 CodeMentor DS，一个友好的编程教育助教。请用简单易懂的中文解释代码，适合初学者理解。'
    },
    {
      role: 'user',
      content: `请解释以下 ${languageNames[language]} 代码：

\`\`\`${language}
${code}
\`\`\`

请逐行或逐块解释，使用生动的比喻帮助理解。`
    }
  ];

  return await callAI(messages, 0.7);
}

/**
 * AI 错误诊断
 */
export async function diagnoseError(
  code: { html: string; css: string; js: string },
  errorMessage: string
): Promise<AIResponse> {
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: '你是 CodeMentor DS，专门帮助学生调试代码错误。请用友好的语言解释错误原因，并给出具体的修复建议。'
    },
    {
      role: 'user',
      content: `代码出现了错误：${errorMessage}

HTML:
\`\`\`html
${code.html}
\`\`\`

CSS:
\`\`\`css
${code.css}
\`\`\`

JavaScript:
\`\`\`javascript
${code.js}
\`\`\`

请帮我找出问题并给出修复方案。`
    }
  ];

  return await callAI(messages, 0.7);
}

/**
 * AI 生成提示
 */
export async function generateHint(
  challenge: { title: string; description: string; instructions: string },
  currentCode: { html: string; css: string; js: string },
  hintLevel: number
): Promise<AIResponse> {
  const hintLevelDescriptions = {
    1: '轻微提示，仅指出方向',
    2: '中等提示，给出具体步骤',
    3: '详细提示，接近答案'
  };

  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `你是 CodeMentor DS。学生在挑战中遇到困难，需要你的提示。提示级别：${hintLevelDescriptions[hintLevel as keyof typeof hintLevelDescriptions]}。
      
请给出恰当程度的提示，既不直接给答案，也不过于模糊。`
    },
    {
      role: 'user',
      content: `挑战：${challenge.title}
要求：${challenge.instructions}

学生当前的代码：
HTML: ${currentCode.html.substring(0, 200)}...
CSS: ${currentCode.css.substring(0, 200)}...
JS: ${currentCode.js.substring(0, 200)}...

请给我一个级别 ${hintLevel} 的提示。`
    }
  ];

  return await callAI(messages, 0.8);
}

/**
 * AI 对话助手
 */
export async function chatWithAI(
  userMessage: string,
  conversationHistory: AIMessage[] = []
): Promise<AIResponse> {
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `你是 CodeMentor DS，GameCode Lab 的 AI 编程助教。你性格友好、耐心，善于用生动的比喻讲解编程概念。
      
你的职责：
- 回答编程相关的问题
- 讲解 HTML、CSS、JavaScript 知识
- 帮助调试代码
- 提供学习建议

请用简洁、友好的中文回复，适合初学者理解。`
    },
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage
    }
  ];

  return await callAI(messages, 0.8);
}

/**
 * AI 生成挑战
 */
export async function generateChallenge(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<AIResponse> {
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `你是 CodeMentor DS，需要生成一个编程挑战。

返回 JSON 格式：
{
  "title": "挑战标题",
  "description": "简短描述",
  "instructions": "详细步骤",
  "starterCode": {
    "html": "起始 HTML 代码",
    "css": "起始 CSS 代码",
    "js": "起始 JS 代码"
  },
  "hints": ["提示1", "提示2", "提示3"]
}`
    },
    {
      role: 'user',
      content: `生成一个关于「${topic}」的${difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}编程挑战。`
    }
  ];

  return await callAI(messages, 0.9);
}

