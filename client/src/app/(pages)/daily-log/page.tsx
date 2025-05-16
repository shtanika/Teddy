'use client';
import { useState, useEffect, useDeferredValue } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { MoodSelector } from '@/components/features/daily-log/MoodSelector';
import { SleepTracker } from '@/components/features/daily-log/SleepTracker';
import { ExerciseLogger } from '@/components/features/daily-log/ExerciseLogger';
import { apiClient } from '@/lib/api-client';
import { authClient } from '@/lib/auth-client';

export default function DailyLogPage() {

  const [userData, setUserData] = useState<{ user: string; id: string } | null>(null);
  const userId = 'example-user-id';

  const [mood, setMood] = useState<string | null>(null);
  const [sleep, setSleep] = useState<{ duration: number; quality: number } | null>(null);
  const [exercise, setExercise] = useState<any[] | null>(null);
  const [moodMessage, setMoodMessage] = useState<string | null>(null);
  const [sleepMessage, setSleepMessage] = useState<string | null>(null);
  const [exerciseMessage, setExerciseMessage] = useState<string | null>(null);

  useEffect(() => {
  async function fetchUser() {
    const { data: session } = await authClient.getSession();
    console.log('Session data:', session);  // Check this output
    if (session?.user?.name && session.session.userId) {
      setUserData({
        user: session.user.name,
        id: session.session.userId,
      });
    }
  }
  fetchUser();
}, []);

  const handleMoodSelect = (selectedMood: string) => {
    setMood(selectedMood);
  };

  const handleSleepUpdate = (duration: number, quality: number) => {
    setSleep({ duration, quality });
  };
  
  const handleExerciseUpdate = (exercises: any[]) => {
    setExercise(exercises);
  };
  
  const handleSubmitMood = async () => {
  if (!userData) return alert('Please sign in');
  if (!mood) return alert('Please select a mood');

  const moodMap: Record<string, number> = {
    terrible: 1,
    bad: 2,
    okay: 3,
    good: 4,
    great: 5,
  };

  const moodValue = moodMap[mood];
  if (!moodValue) return alert('Invalid mood selected');

  try {
    const response = await apiClient.createDailyLog({
      userId: userData.id,
      mood: moodValue, // simple conversion
    });
    setMoodMessage('Mood submitted successfully!');
    setMood(null);

    setTimeout(() => setMoodMessage(null), 5000);


    console.log('Mood submitted:', response);
  } catch (err) {
    console.error('Error submitting mood:', err);
    setMoodMessage('Failed to submit mood. Try again.');
    setTimeout(() => setMoodMessage(null), 5000);
  }
};

  const handleSubmitSleep = async () => {
  if (!userData) return alert('Please sign in');
  if (!sleep) return alert('Please update sleep data');

  const qualityMap: Record<number, string> = {
  1: 'poor',
  2: 'fair',
  3: 'good',
  4: 'very good',
  5: 'excellent',
  };

  try {
    const response = await apiClient.createDailyLog({
      userId: userData.id,
      sleep: {
        duration: sleep.duration,
        quality: qualityMap[sleep.quality],
        sleepGoal: 8,
      },
    });
    console.log('Sleep submitted:', response);
    setSleepMessage('Sleep data submitted successfully!');
    setTimeout(() => setSleepMessage(null), 5000);
  } catch (err) {
    console.error('Error submitting sleep:', err);
    setSleepMessage('Failed to submit sleep data. Try again.');
    setTimeout(() => setSleepMessage(null), 5000);
  }
};

const handleSubmitExercise = async () => {
  if (!userData) return alert('Please sign in');
  if (!exercise || exercise.length === 0) return alert('Please log exercise');

  try {
    const response = await apiClient.createDailyLog({
      userId: userData.id,
      exercises: {
        create: exercise.map((ex) => ({
          type: ex.type || 'other',
          duration: ex.duration,          // ensure duration exists and is number
          intensity: ex.intensity?.toString() || 'moderate',
          customType: undefined,
        })),
      },
    });

    console.log('Exercise submitted:', response);
    setExerciseMessage('Exercise data submitted successfully!');
    setTimeout(() => setExerciseMessage(null), 5000);
  } catch (err) {
    console.error('Error submitting exercise:', err);
    setExerciseMessage('Failed to submit exercise data. Try again.');
    setTimeout(() => setExerciseMessage(null), 5000);
  }
};

  const defaultGoals = [
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


  const buttonClass =
    "w-full py-2 px-4 bg-teddy-accent text-white rounded-lg font-medium hover:bg-teddy-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <PageContainer title="Daily Log">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <MoodSelector onMoodSelect={handleMoodSelect} />
          {moodMessage && (
            <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">
              {moodMessage}
              </div>
            )}
           <button
            onClick={handleSubmitMood}
            disabled={!mood}
            className={buttonClass}
          >
            Submit Mood
          </button>
          <SleepTracker onSleepUpdate={handleSleepUpdate} />
          {sleepMessage && (
            <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">
              {sleepMessage}
              </div>
            )}
          <button
            onClick={handleSubmitSleep}
            disabled={!sleep}
            className={buttonClass}
          >
            Submit Sleep
          </button>
          <ExerciseLogger onExerciseUpdate={handleExerciseUpdate} />
          {exerciseMessage && (
            <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">
              {exerciseMessage}
              </div>
            )}
          <button
            onClick={handleSubmitExercise}
            disabled={!exercise}
            className={buttonClass}
          >
            Submit Exercise
          </button>
        </div>
      </div>
    </PageContainer>
  );
} 