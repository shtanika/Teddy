import { cn } from "@/lib/utils";

interface StatProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Stat({
  title,
  value,
  icon,
  trend,
  description,
  variant = 'default',
  className,
}: StatProps) {
  const variants = {
    default: "text-teddy-brown",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
    info: "text-blue-500",
  };

  return (
    <div className={cn("flex items-start gap-4 p-4 rounded-lg bg-white/90 backdrop-blur-md", className)}>
      {icon && (
        <div className={cn("p-2 rounded-lg bg-teddy-beige/50", variants[variant])}>
          {icon}
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-sm font-medium text-teddy-muted">{title}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-2xl font-semibold text-teddy-brown">{value}</p>
          {trend && (
            <span className={cn(
              "text-sm font-medium",
              trend.value >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm text-teddy-muted">{description}</p>
        )}
      </div>
    </div>
  );
} 