import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLAttributes } from "react";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
  status?: 'online' | 'offline' | 'away';
}

export function Avatar({ 
  className, 
  src, 
  alt = "User avatar",
  size = 'md',
  fallback,
  status,
  ...props 
}: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
  };

  return (
    <div className="relative inline-flex">
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full bg-teddy-beige/50 text-teddy-brown font-medium",
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="rounded-full object-cover"
          />
        ) : fallback ? (
          <span className="flex h-full w-full items-center justify-center">
            {fallback}
          </span>
        ) : (
          <svg
            className="h-full w-full text-teddy-brown/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white",
            statusColors[status]
          )}
        />
      )}
    </div>
  );
} 