import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { defaultChartOptions, chartColors } from './chartConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
  options?: ChartOptions<'bar'>;
  height?: string;
}

export function BarChart({
  labels,
  datasets,
  options,
  height = '300px',
}: BarChartProps) {
  const defaultDatasets = datasets.map((dataset, index) => ({
    ...dataset,
    backgroundColor: dataset.backgroundColor || chartColors.primary,
    borderColor: dataset.borderColor || chartColors.primary,
    borderWidth: dataset.borderWidth ?? 1,
    borderRadius: 4,
  }));

  const chartData = {
    labels,
    datasets: defaultDatasets,
  };

  const chartOptions: ChartOptions<'bar'> = {
    ...defaultChartOptions,
    ...options,
  };

  return (
    <div style={{ height }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
} 