/** 北京信息科技大学 · 信息科大编程实验室 · 信工实习 · AI编程 品牌配置 */
export const BRAND = {
  name: '信息科大编程实验室',
  program: '信工实习',
  programTag: 'AI编程',
  programLabel: '信工实习 · AI编程',
  subtitle: '信工实习 · AI编程 · 北京信息科技大学 Web 编程学习平台',
  university: '北京信息科技大学',
  universityEn: 'Beijing Information Science & Technology University',
  shortName: '信息科大',
  aiAssistant: '信工实习 AI编程助教',
  website: 'https://www.bistu.edu.cn/',
  viWebsite: 'https://vi.bistu.edu.cn/',
  motto: '勤以为学，信以立身',
  founded: '1957',
  campuses: ['小营校区', '健翔桥校区', '清河校区', '金台路校区', '新校区'],
  colors: {
    primary: '#003087',
    primaryLight: '#1a4da6',
    primaryDark: '#002060',
    accent: '#C8102E',
    accentLight: '#e8394f',
    gold: '#B8860B',
    bgLight: '#f0f4fa',
    bgGradient: 'linear-gradient(135deg, #f0f4fa 0%, #e8eef8 50%, #fdf2f4 100%)',
  },
  logo: '/images/bistu/bistuwrite.png',
  campusBanner: '/images/bistu/campus-banner.svg',
  contact: {
    email: 'support@bistu.edu.cn',
  },
} as const;

export const SCHOOL_INTRO = {
  title: '关于北京信息科技大学',
  paragraphs: [
    '北京信息科技大学是一所以信息学科为特色的北京市属全日制普通高等学校，办学历史可追溯至1957年。',
    '「信工实习 · AI编程」面向信息工程学院及相关专业学生，结合实习场景与 AI 智能辅导，提供 Web 前端编程实践平台。',
    '信息科大编程实验室通过游戏化闯关与 AI 编程助教，帮助你在信工实习中快速掌握 HTML、CSS、JavaScript 等核心技能。',
  ],
  highlights: [
    { icon: '🏫', label: '1957年办学', desc: '深厚工科底蕴' },
    { icon: '💻', label: '信工实习', desc: '信息工程实践教学' },
    { icon: '🤖', label: 'AI编程', desc: 'AI 助教全程辅导' },
    { icon: '🎓', label: '五育并举', desc: '全面发展育人理念' },
  ],
} as const;

export function pageTitle(suffix?: string): string {
  const base = `${BRAND.programLabel} - ${BRAND.name}`;
  return suffix ? `${suffix} - ${base}` : `${base} - ${BRAND.university}`;
}
