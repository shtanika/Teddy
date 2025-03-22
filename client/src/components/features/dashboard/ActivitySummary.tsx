import { Card } from "@/components/common/Card";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { Stat } from "@/components/common/Stat";

interface ActivitySummaryProps {
  weeklyActivity: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
  dailyBreakdown: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
  className?: string;
}

export function ActivitySummary({
  weeklyActivity,
  dailyBreakdown,
  className,
}: ActivitySummaryProps) {
  return (
    <>
      {/* Weekly Activity Chart */}
      <Card variant="elevated" padding="md" className="lg:col-span-2">
        <h3 className="text-lg font-semibold text-teddy-brown mb-4">Weekly Steps</h3>
        <div className="w-full h-[300px]">
          <LineChart
            labels={weeklyActivity.labels}
            datasets={weeklyActivity.datasets}
            height="100%"
          />
        </div>
      </Card>

      {/* Daily Breakdown Chart */}
      <Card variant="elevated" padding="md" className="lg:col-span-1">
        <h3 className="text-lg font-semibold text-teddy-brown mb-4">Weekly Exercise Time</h3>
        <div className="w-full h-[300px]">
          <BarChart
            labels={dailyBreakdown.labels}
            datasets={dailyBreakdown.datasets}
            height="100%"
          />
        </div>
      </Card>
    </>
  );
} 