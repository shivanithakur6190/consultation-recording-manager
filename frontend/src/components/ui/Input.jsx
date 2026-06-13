import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(
  ({ label, type = 'text', error, icon: Icon, className = '', ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1.5 text-gray-600 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon size={18} />
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full rounded-xl px-4 py-2.5 text-sm
              bg-white/50 dark:bg-white/5 backdrop-blur-sm
              border ${error ? 'border-red-500' : 'border-gray-300 dark:border-white/10'}
              text-text-dark dark:text-textLight placeholder:text-gray-400
              focus:ring-2 focus:ring-primary/50 focus:border-primary
              transition-all duration-200
              ${Icon ? 'pl-10' : ''}
              ${isPassword ? 'pr-10' : ''}
              ${className}
            `}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;