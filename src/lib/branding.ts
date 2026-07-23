/** 北京信息科技大学 · 信息科大编程实验室 · 信工实习 · AI编程 品牌配置 */
/** 图片来源：https://vi.bistu.edu.cn/ 与 https://www.bistu.edu.cn/ */

export const BISTU_IMAGES = {
  logo: '/images/bistu/bistuwrite.png',
  logoOfficial: '/images/bistu/logo-official.png',
  homeLogo: '/images/bistu/home_logo.png',
  footerLogo: '/images/bistu/footer-logo.png',
  campusBanner: '/images/bistu/campus.jpg',
  favicon: '/images/bistu/favicon.ico',
  vi: {
    logoUsage: '/images/bistu/vi-mode01-1.png',
    logoVariations: '/images/bistu/vi-mode01-2.png',
    colors: '/images/bistu/vi-mode01-3.png',
    graphics: '/images/bistu/vi-mode01-4.png',
    typography: '/images/bistu/vi-mode01-5.png',
    imageUsage: '/images/bistu/vi-mode01-6.png',
    office: '/images/bistu/vi-mode02-1.png',
    multimedia: '/images/bistu/vi-mode02-2.png',
  },
} as const;

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
  logo: BISTU_IMAGES.logo,
  campusBanner: BISTU_IMAGES.campusBanner,
  favicon: BISTU_IMAGES.favicon,
  images: BISTU_IMAGES,
  contact: {
    email: 'mingxinai@agentmail.to',
    emailAlt: '13426086861@139.com',
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
    { image: BISTU_IMAGES.vi.logoUsage, label: '1957年办学', desc: '深厚工科底蕴' },
    { image: BISTU_IMAGES.vi.office, label: '信工实习', desc: '信息工程实践教学' },
    { image: BISTU_IMAGES.vi.colors, label: 'AI编程', desc: 'AI 助教全程辅导' },
    { image: BISTU_IMAGES.vi.typography, label: '五育并举', desc: '全面发展育人理念' },
  ],
} as const;

export const PLATFORM_FEATURES = [
  {
    image: BISTU_IMAGES.vi.multimedia,
    title: `${BRAND.program} · ${BRAND.programTag}`,
    desc: '信工实习与 AI 编程相结合的游戏化学习体系：闯关、任务与 Boss 挑战，在实习场景中掌握 Web 开发技能。',
  },
  {
    image: BISTU_IMAGES.vi.graphics,
    title: BRAND.aiAssistant,
    desc: 'DeepSeek 驱动的 AI 助教，提供实时代码讲解、错误诊断，举例贴近信息科大校园场景。',
  },
  {
    image: BISTU_IMAGES.vi.office,
    title: '在线代码编辑器',
    desc: '内置专业编辑器，HTML/CSS/JavaScript 实时预览，在浏览器中完成所有实验。',
  },
  {
    image: BISTU_IMAGES.vi.logoUsage,
    title: '系统化课程',
    desc: '从新生欢迎页到综合实战，课程案例融入信息学院与计算机专业学习场景。',
  },
  {
    image: BISTU_IMAGES.vi.imageUsage,
    title: '成就与排行榜',
    desc: '解锁成就徽章，与信息科大同学竞争排名，激发学习动力。',
  },
  {
    image: BISTU_IMAGES.vi.logoVariations,
    title: '同学作品墙',
    desc: '分享校园主题 Web 作品，获得点赞与评论，共同进步成长。',
  },
] as const;

export function pageTitle(suffix?: string): string {
  const base = `${BRAND.programLabel} - ${BRAND.name}`;
  return suffix ? `${suffix} - ${base}` : `${base} - ${BRAND.university}`;
}
