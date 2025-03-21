import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showValue = false,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const circumference = 2 * Math.PI * 45; // r=45

  const variants = {
    default: "stroke-teddy-brown",
    success: "stroke-green-500",
    warning: "stroke-yellow-500",
    error: "stroke-red-500",
  };

  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div className={cn("relative inline-flex", sizes[size], className)}>
      <svg className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          className="stroke-teddy-beige/50"
          strokeWidth="8"
          fill="none"
          r="45"
          cx="50%"
          cy="50%"
        />
        {/* Progress circle */}
        <circle
          className={cn(
            "transition-all duration-500 ease-in-out",
            variants[variant]
          )}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (percentage / 100) * circumference}
          strokeLinecap="round"
          fill="none"
          r="45"
          cx="50%"
          cy="50%"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-medium text-teddy-brown">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
} 