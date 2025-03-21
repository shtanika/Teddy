import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  className, 
  variant = 'default', 
  padding = 'md',
  children, 
  ...props 
}: CardProps) {
  const baseStyles = "rounded-xl bg-white/90 backdrop-blur-md";
  
  const variants = {
    default: "shadow-sm border border-teddy-muted/20",
    elevated: "shadow-lg border border-teddy-muted/30",
    outlined: "border-2 border-teddy-muted/40 shadow-none",
  };

  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div 
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 