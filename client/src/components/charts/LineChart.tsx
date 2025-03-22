import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { defaultChartOptions, chartColors } from './chartConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
    fill?: boolean;
  }[];
  options?: ChartOptions<'line'>;
  height?: string;
}

export function LineChart({
  labels,
  datasets,
  options,
  height = '300px',
}: LineChartProps) {
  const defaultDatasets = datasets.map((dataset, index) => ({
    ...dataset,
    borderColor: dataset.borderColor || chartColors.primary,
    backgroundColor: dataset.backgroundColor || `${chartColors.primary}20`,
    tension: dataset.tension ?? 0.4,
    fill: dataset.fill ?? false,
    borderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6,
  }));

  const chartData = {
    labels,
    datasets: defaultDatasets,
  };

  const chartOptions: ChartOptions<'line'> = {
    ...defaultChartOptions,
    ...options,
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
} 