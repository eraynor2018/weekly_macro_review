interface BadgeProps {
  variant: 'high' | 'medium' | 'low' | 'info' | 'success' | 'warning';
  children: React.ReactNode;
  className?: string;
}

const variantMap: Record<BadgeProps['variant'], string> = {
  high: 'bg-red-700 text-red-100',
  medium: 'bg-amber-700 text-amber-100',
  low: 'bg-slate-600 text-slate-200',
  info: 'bg-blue-700 text-blue-100',
  success: 'bg-green-700 text-green-100',
  warning: 'bg-amber-600 text-amber-100',
};

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${variantMap[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
