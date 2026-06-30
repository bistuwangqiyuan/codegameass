import { BRAND } from '../../lib/branding';

interface ProgramBadgeProps {
  size?: 'sm' | 'md';
  className?: string;
}

export default function ProgramBadge({ size = 'md', className = '' }: ProgramBadgeProps) {
  const pillBase =
    size === 'sm'
      ? 'rounded-full px-2 py-0.5 text-xs font-semibold'
      : 'rounded-full px-3 py-1 text-sm font-semibold';

  return (
    <div className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      <span className={`${pillBase} bg-bistu-primary text-white`}>{BRAND.program}</span>
      <span className={`${pillBase} bg-bistu-accent text-white`}>{BRAND.programTag}</span>
    </div>
  );
}
