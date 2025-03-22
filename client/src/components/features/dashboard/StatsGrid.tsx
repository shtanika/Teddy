import { Stat } from "@/components/common/Stat";
import { Card } from "@/components/common/Card";

interface StatItem {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

interface StatsGridProps {
  stats: StatItem[];
  className?: string;
}

export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} variant="elevated" padding="md">
          <Stat {...stat} />
        </Card>
      ))}
    </>
  );
} 