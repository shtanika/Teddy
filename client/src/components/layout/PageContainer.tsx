'use client';
import Header from './Header';

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
    <div className="min-h-screen">
      <Header title={title} subtitle={subtitle} />
      <div className="p-8">
        {children}
      </div>
    </div>
  );
} 