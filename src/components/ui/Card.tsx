import { ReactNode } from 'react';

interface CardProps {
  variant?: 'default' | 'red' | 'amber' | 'purple' | 'green' | 'blue';
  className?: string;
  children: ReactNode;
}

const variantMap: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-slate-800 border border-slate-700',
  red: 'bg-red-950 border border-red-800',
  amber: 'bg-amber-950 border border-amber-700',
  purple: 'bg-purple-950 border border-purple-800',
  green: 'bg-green-950 border border-green-800',
  blue: 'bg-blue-950 border border-blue-800',
};

export default function Card({ variant = 'default', className = '', children }: CardProps) {
  return (
    <div className={`rounded-lg p-4 ${variantMap[variant]} ${className}`}>
      {children}
    </div>
  );
}
