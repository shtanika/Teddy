'use client';
import PageContainer from '@/components/layout/PageContainer';
import { MoodSelector } from '@/components/features/daily-log/MoodSelector';
import { SleepTracker } from '@/components/features/daily-log/SleepTracker';
import { ExerciseLogger } from '@/components/features/daily-log/ExerciseLogger';
import { DailyProgress } from '@/components/features/daily-log/DailyProgress';
import { QuickLog } from '@/components/features/daily-log/QuickLog';

export default function DailyLogPage() {
  const handleMoodSelect = (mood: string) => {
    console.log('Selected mood:', mood);
  };

  const handleSleepUpdate = (duration: number, quality: number) => {
    console.log('Sleep update:', { duration, quality });
  };

  const handleExerciseUpdate = (exercises: any[]) => {
    console.log('Exercise update:', exercises);
  };

  const handleProgressUpdate = (goals: any[]) => {
    console.log('Progress update:', goals);
  };

  const handleQuickLogUpdate = (entries: any[]) => {
    console.log('Quick log update:', entries);
  };

  const defaultGoals = [
    {
      id: 'steps',
      name: 'Steps',
      target: 10000,
      current: 0,
      unit: 'steps',
      icon: '👣',
      color: 'bg-blue-100 text-blue-700',
    },
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

  return (
    <PageContainer title="Daily Log">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <MoodSelector onMoodSelect={handleMoodSelect} />
          <SleepTracker onSleepUpdate={handleSleepUpdate} />
          <ExerciseLogger onExerciseUpdate={handleExerciseUpdate} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <DailyProgress goals={defaultGoals} onGoalUpdate={handleProgressUpdate} />
          <QuickLog onLogUpdate={handleQuickLogUpdate} />
        </div>
      </div>
    </PageContainer>
  );
} 