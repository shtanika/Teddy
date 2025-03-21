import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md',
    icon,
    ...props 
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teddy-brown/20 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-teddy-brown text-white hover:bg-teddy-accent",
      ghost: "text-teddy-brown hover:bg-teddy-beige/50",
      outline: "border-2 border-teddy-brown text-teddy-brown hover:bg-teddy-beige/50",
    };

    const sizes = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton"; 