'use client';

import { Card } from '@/components/common/Card';
import { CircularProgress } from '@/components/common/CircularProgress';
import { ProgressBar } from '@/components/common/ProgressBar';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  icon: string;
  color: string;
}

interface DailyProgressProps {
  goals: Goal[];
  onGoalUpdate?: (goals: Goal[]) => void;
  className?: string;
}

const defaultGoals: Goal[] = [
  {
    id: 'exercise',
    name: 'Exercise',
    target: 30,
    current: 0,
    unit: 'minutes',
    icon: '🏃',
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 'sleep',
    name: 'Sleep',
    target: 8,
    current: 0,
    unit: 'hours',
    icon: '😴',
    color: 'bg-indigo-100 text-indigo-700',
  },
];

export function DailyProgress({ goals = defaultGoals, onGoalUpdate, className }: DailyProgressProps) {
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const handleIncrement = (goalId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const increment = goal.id === 'exercise' ? 5 : 
                         goal.id === 'sleep' ? 1 : 50;
        return {
          ...goal,
          current: Math.min(goal.current + increment, goal.target),
        };
      }
      return goal;
    });
    onGoalUpdate?.(updatedGoals);
  };

  const handleDecrement = (goalId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const decrement = goal.id === 'exercise' ? 5 : 
                         goal.id === 'sleep' ? 1 : 50;
        return {
          ...goal,
          current: Math.max(goal.current - decrement, 0),
        };
      }
      return goal;
    });
    onGoalUpdate?.(updatedGoals);
  };

  const overallProgress = Math.round(
    goals.reduce((acc, goal) => acc + calculateProgress(goal.current, goal.target), 0) / goals.length
  );

  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-teddy-brown">Daily Progress</h3>
          <div className="flex items-center gap-2">
            <CircularProgress
              value={overallProgress}
              size="md"
              className="text-teddy-accent"
            />
            <span className="text-sm font-medium text-teddy-brown">{overallProgress}%</span>
          </div>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.current, goal.target);
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`p-2 rounded-lg ${goal.color}`}>{goal.icon}</span>
                    <div>
                      <div className="font-medium text-teddy-brown">{goal.name}</div>
                      <div className="text-sm text-teddy-muted">
                        {goal.current} / {goal.target} {goal.unit}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecrement(goal.id)}
                      className="p-1 rounded-full hover:bg-teddy-beige/30 text-teddy-muted hover:text-teddy-brown"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleIncrement(goal.id)}
                      className="p-1 rounded-full hover:bg-teddy-beige/30 text-teddy-muted hover:text-teddy-brown"
                    >
                      +
                    </button>
                  </div>
                </div>
                <ProgressBar
                  value={progress}
                  className={`h-2 ${goal.color}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
} 