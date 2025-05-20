'use client';

import { useState, useEffect, ReactElement } from "react";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { StatsGrid } from "@/components/features/dashboard/StatsGrid";
import { ActivitySummary } from "@/components/features/dashboard/ActivitySummary";
import PageContainer from "@/components/layout/PageContainer";

type StatItem = {
  title: string;
  value: string;
  icon: ReactElement;
  trend: {
    value: number;
    label: string;
  };
  variant: 'success' | 'warning' | 'error' | 'info';
};

type Dataset = {
  label: string;
  data: number[];
};

type Breakdown = {
  labels: string[];
  datasets: Dataset[];
};

// Added this type for daily log objects
type DailyLog = {
  date: string;
  mood?: number;
  sleep?: { duration: number; sleepGoal?: number }[];
  exercises?: { duration: number }[];
};

export default function DashboardPage() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [breakdown, setBreakdown] = useState<Breakdown>({ labels: [], datasets: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const sessionResult = await authClient.getSession();

        if ('error' in sessionResult && sessionResult.error) {
          setError('Failed to get user session');
          setLoading(false);
          return;
        }

        if ('data' in sessionResult && sessionResult.data?.session?.userId) {
          const userId = sessionResult.data.session.userId;

          const dailyLogs: DailyLog[] = await apiClient.getDailyLogs(userId);

          if (!dailyLogs || dailyLogs.length === 0) {
            setError('No daily logs found');
            setLoading(false);
            return;
          }

          // Sort logs by date descending (newest first)
          dailyLogs.sort((a: DailyLog, b: DailyLog) => new Date(b.date).getTime() - new Date(a.date).getTime());

          const latestLog = dailyLogs[0];

          // --- Mood ---
          const moodValue = latestLog.mood;
          const moodLabel = moodValue
            ? moodValue >= 5 ? 'Happy' : moodValue >= 4 ? 'Okay' : 'Sad'
            : 'N/A';

          // --- Sleep ---
          const sleepDurations: number[] = latestLog.sleep?.map((s) => s.duration) || [];
          const totalSleep = sleepDurations.length > 0
            ? sleepDurations.reduce((sum: number, d: number) => sum + d, 0)
            : 0;

          const sleepGoal = latestLog.sleep?.[0]?.sleepGoal || 8;

          // --- Exercise ---
          const totalExercise = latestLog.exercises?.reduce(
            (sum: number, ex: {duration: number}) => sum + (ex.duration || 0),
            0
          ) || 0;

          // --- Breakdown: last 7 days exercise ---
          const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0,0,0,0);
            return d;
          }).reverse();

          const dayLabels = last7Days.map(d => d.toLocaleDateString(undefined, { weekday: 'short' }));

          const exerciseData = last7Days.map(day => {
            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);

            const logsForDay = dailyLogs.filter((log: DailyLog) => {
              const logDate = new Date(log.date);
              return logDate >= dayStart && logDate <= dayEnd;
            });

            return logsForDay.reduce((sum: number, log: DailyLog) => {
              return sum + (log.exercises?.reduce((eSum: number, ex) => eSum + (ex.duration || 0), 0) || 0);
            }, 0);
          });

          // --- Prepare stats array ---
          const transformedStats: StatItem[] = [
            {
              title: "Mood",
              value: moodLabel,
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              trend: { value: 8, label: "Better than yesterday" }, // Placeholder for real trend
              variant: "success",
            },
            {
              title: "Sleep",
              value: `${totalSleep.toFixed(1)} hrs`,
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ),
              trend: { value: totalSleep - sleepGoal, label: `Goal: ${sleepGoal} hrs` },
              variant: totalSleep >= sleepGoal ? "success" : "warning",
            },
            {
              title: "Exercise",
              value: `${totalExercise} min`,
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              ),
              trend: { value: totalExercise - 60, label: "Goal: 60 min" },
              variant: totalExercise >= 60 ? "success" : "warning",
            },
          ];

          // --- Prepare breakdown for chart ---
          const transformedBreakdown: Breakdown = {
            labels: dayLabels,
            datasets: [
              {
                label: "Exercise Time",
                data: exerciseData,
              },
            ],
          };

          setStats(transformedStats);
          setBreakdown(transformedBreakdown);
        } else {
          setError('User session not found');
        }
      } catch (err) {
        console.error(err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <PageContainer title="Loading..." subtitle="">Loading your dashboard...</PageContainer>;
  }

  if (error) {
    return <PageContainer title="Error" subtitle="">{error}</PageContainer>;
  }

  return (
    <PageContainer 
      title="Welcome Back!"
      subtitle="Track your wellness journey"
    >
      <div className="space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <StatsGrid stats={stats} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <ActivitySummary dailyBreakdown={breakdown} />
        </div>
      </div>
    </PageContainer>
  );
}
