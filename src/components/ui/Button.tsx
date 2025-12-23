import React from 'react';
import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        children,
        variant = 'primary',
        size = 'md',
        isLoading = false,
        leftIcon,
        rightIcon,
        className = '',
        disabled,
        ...props
    }, ref) => {

        return (
            <button
                ref={ref}
                className={`
          ${styles.btn} 
          ${styles[variant]} 
          ${styles[size]} 
          ${isLoading || disabled ? styles.disabled : ''} 
          ${className}
        `}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {!isLoading && leftIcon && <span className="flex items-center">{leftIcon}</span>}
                {children}
                {!isLoading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';
