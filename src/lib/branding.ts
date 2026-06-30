/** 北京信息科技大学 · 信息科大编程实验室 品牌配置 */
export const BRAND = {
  name: '信息科大编程实验室',
  subtitle: '北京信息科技大学 · 大学生 Web 编程学习平台',
  university: '北京信息科技大学',
  universityEn: 'Beijing Information Science & Technology University',
  shortName: '信息科大',
  aiAssistant: '信息科大 AI 编程助教',
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
  logo: '/images/bistu/logo.svg',
  campusBanner: '/images/bistu/campus-banner.svg',
  contact: {
    email: 'support@bistu.edu.cn',
  },
} as const;

export const SCHOOL_INTRO = {
  title: '关于北京信息科技大学',
  paragraphs: [
    '北京信息科技大学是一所以信息学科为特色的北京市属全日制普通高等学校，办学历史可追溯至1957年。',
    '学校现有5个校区，信息学科优势突出，计算机、软件工程等专业为大学生提供了扎实的工程实践平台。',
    '信息科大编程实验室面向全校大学生，通过游戏化闯关与 AI 辅导，帮助你在 Web 前端开发领域快速成长。',
  ],
  highlights: [
    { icon: '🏫', label: '1957年办学', desc: '深厚工科底蕴' },
    { icon: '💻', label: '信息特色', desc: '计算机与软件工程优势学科' },
    { icon: '🌐', label: '5个校区', desc: '小营·健翔桥·清河·金台路·新校区' },
    { icon: '🎓', label: '五育并举', desc: '全面发展育人理念' },
  ],
} as const;

export function pageTitle(suffix?: string): string {
  return suffix ? `${suffix} - ${BRAND.name}` : `${BRAND.name} - ${BRAND.subtitle}`;
}
