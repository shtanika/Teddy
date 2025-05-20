import { Card } from "@/components/common/Card";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { Stat } from "@/components/common/Stat";

interface ActivitySummaryProps {
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
  dailyBreakdown,
  className,
}: ActivitySummaryProps) {
  return (
    <>
      {/* Daily Breakdown Chart */}
      <Card variant="elevated" padding="md" className="lg:col-span-3">
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