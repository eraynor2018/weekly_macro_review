import { ButtonHTMLAttributes, ReactNode } from 'react';
import Spinner from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const variantMap = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200 disabled:bg-slate-800',
  danger: 'bg-red-700 hover:bg-red-600 text-white disabled:bg-red-900',
  ghost: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-50',
};

const sizeMap = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors cursor-pointer disabled:cursor-not-allowed ${variantMap[variant]} ${sizeMap[size]} ${className}`}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  );
}
