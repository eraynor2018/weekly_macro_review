import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  mono?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, mono = false, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-slate-800 border ${
            error ? 'border-red-500' : 'border-slate-600'
          } rounded-md px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors ${
            mono ? 'font-mono text-sm' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
