import { ChartOptions } from 'chart.js';

export const defaultChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#8B4513', // teddy-brown
        font: {
          family: 'Inter',
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(245, 230, 211, 0.9)', // teddy-beige with opacity
      titleColor: '#8B4513', // teddy-brown
      bodyColor: '#8B4513', // teddy-brown
      borderColor: '#D2B48C', // teddy-muted
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      boxPadding: 4,
      usePointStyle: true,
      callbacks: {
        label: (context) => {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toLocaleString();
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(210, 180, 140, 0.1)', // teddy-muted with opacity
      },
      ticks: {
        color: '#8B4513', // teddy-brown
        font: {
          family: 'Inter',
        },
      },
    },
    y: {
      grid: {
        color: 'rgba(210, 180, 140, 0.1)', // teddy-muted with opacity
      },
      ticks: {
        color: '#8B4513', // teddy-brown
        font: {
          family: 'Inter',
        },
      },
    },
  },
};

export const chartColors = {
  primary: '#8B4513', // teddy-brown
  secondary: '#A0522D', // teddy-accent
  muted: '#D2B48C', // teddy-muted
  background: '#F5E6D3', // teddy-beige
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
}; 