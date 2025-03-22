import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { chartColors } from './chartConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

interface SparklineChartProps {
  data: number[];
  labels?: string[];
  color?: string;
  height?: string;
  width?: string;
}

export function SparklineChart({
  data,
  labels = [],
  color = chartColors.primary,
  height = '40px',
  width = '100px',
}: SparklineChartProps) {
  const chartData = {
    labels: labels.length ? labels : Array.from({ length: data.length }, (_, i) => i.toString()),
    datasets: [
      {
        data,
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height, width }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
} 