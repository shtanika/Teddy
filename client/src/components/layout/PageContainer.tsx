'use client';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  backLink?: string;
  backText?: string;
}

export default function PageContainer({ 
  children, 
  title,
  subtitle,
  backLink,
  backText
}: PageContainerProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-8">
        {backLink && backText && (
          <a 
            href={backLink} 
            className="flex items-center text-teddy-accent hover:text-teddy-brown mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            {backText}
          </a>
        )}
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
