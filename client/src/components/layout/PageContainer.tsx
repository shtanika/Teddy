'use client';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function PageContainer({ 
  children, 
  title,
  subtitle 
}: PageContainerProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-teddy-brown">{title}</h1>
        {subtitle && (
          <p className="text-sm text-teddy-accent mt-1">{subtitle}</p>
        )}
      </div>
      <div className="flex-1 p-8 pt-0 overflow-auto">
        {children}
      </div>
    </div>
  );
} 