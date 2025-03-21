import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant = 'default', 
    inputSize = 'md',
    error,
    ...props 
  }, ref) => {
    const baseStyles = "w-full rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teddy-brown/20 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "border-teddy-muted/20 bg-white/90 backdrop-blur-md",
      outlined: "border-2 border-teddy-brown/30 bg-transparent",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6 text-lg",
    };

    return (
      <div className="w-full">
        <input
          className={cn(
            baseStyles,
            variants[variant],
            sizes[inputSize],
            error && "border-red-500 focus-visible:ring-red-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input"; 