import { cn } from "@/lib/utils";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'default' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
  error?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    variant = 'default', 
    inputSize = 'md',
    error,
    options,
    ...props 
  }, ref) => {
    const baseStyles = "w-full rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teddy-brown/20 disabled:pointer-events-none disabled:opacity-50 appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%238B4513%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M10%203a1%201%200%2001.707.293l3%203a1%201%200%2001-1.414%201.414L10%205.414%207.707%207.707a1%201%200%2001-1.414-1.414l3-3A1%201%200%200110%203zm-3.707%209.293a1%201%200%20011.414%200L10%2014.586l2.293-2.293a1%201%200%20011.414%201.414l-3%203a1%201%200%2001-1.414%200l-3-3a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]";
    
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
        <select
          className={cn(
            baseStyles,
            variants[variant],
            sizes[inputSize],
            error && "border-red-500 focus-visible:ring-red-500/20",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select"; 