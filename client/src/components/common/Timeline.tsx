import { cn } from "@/lib/utils";

interface TimelineItem {
  title: string;
  description?: string;
  date?: string;
  icon?: React.ReactNode;
  status?: 'completed' | 'current' | 'upcoming';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("relative space-y-6", className)}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-teddy-beige/50" />
      
      {items.map((item, index) => (
        <div key={index} className="relative pl-12">
          {/* Timeline dot */}
          <div className={cn(
            "absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2",
            item.status === 'completed' && "border-teddy-brown bg-teddy-brown",
            item.status === 'current' && "border-teddy-brown bg-white",
            item.status === 'upcoming' && "border-teddy-muted/30 bg-white",
            !item.status && "border-teddy-brown bg-white"
          )}>
            {item.icon || (
              <div className={cn(
                "h-2 w-2 rounded-full",
                item.status === 'completed' && "bg-white",
                item.status === 'current' && "bg-teddy-brown",
                item.status === 'upcoming' && "bg-teddy-muted/30",
                !item.status && "bg-teddy-brown"
              )} />
            )}
          </div>

          {/* Content */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className={cn(
                "text-sm font-medium",
                item.status === 'upcoming' ? "text-teddy-muted" : "text-teddy-brown"
              )}>
                {item.title}
              </h3>
              {item.date && (
                <span className="text-xs text-teddy-muted">{item.date}</span>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-teddy-muted">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 