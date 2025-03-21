import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showValue = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variants = {
    default: "bg-teddy-brown",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  const sizes = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative overflow-hidden rounded-full bg-teddy-beige/50">
        <div
          className={cn(
            "transition-all duration-500 ease-in-out",
            variants[variant],
            sizes[size]
          )}
          style={{ width: `${percentage}%` }}
        />
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-teddy-brown">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    </div>
  );
} 