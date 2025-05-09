'use client';

import { useEffect, useState } from "react";
import { StatsGrid } from "@/components/features/dashboard/StatsGrid";
import { ActivitySummary } from "@/components/features/dashboard/ActivitySummary";
import PageContainer from "@/components/layout/PageContainer";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import type { StatItem } from "@/components/features/dashboard/StatsGrid";

export default function DashboardPage() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState(null);
  const [dailyBreakdown, setDailyBreakdown] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: session } = await authClient.getSession();

      if (!session?.session?.userId) return;

      try {
        const userId = session.session.userId;
        const logs = await apiClient.getDailyLogs(userId);

        const latestLog = logs?.[0]; // Assuming sorted by newest
        if (!latestLog) return;

        const newStats = [
          {
            title: "Steps",
            value: latestLog.steps?.toLocaleString() || "0",
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ),
            trend: {
              value: latestLog.steps - latestLog.stepsGoal,
              label: `Goal: ${latestLog.stepsGoal}`,
            },
            variant: latestLog.steps >= latestLog.stepsGoal ? "success" as const : "warning" as const,
          },
          {
            title: "Mood",
            value: latestLog.mood || "N/A",
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            trend: { value: 0, label: "Latest mood entry" },
            variant: "success" as const,
          },
          {
            title: "Sleep",
            value: `${latestLog.sleep?.duration ?? 0} hrs`,
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ),
            trend: {
              value: (latestLog.sleep?.duration ?? 0) - (latestLog.sleep?.sleepGoal ?? 8),
              label: `Goal: ${latestLog.sleep?.sleepGoal ?? 8} hrs`,
            },
            variant:
              latestLog.sleep?.duration >= latestLog.sleep?.sleepGoal
                ? "success" as const
                : "warning" as const,
          },
          {
            title: "Exercise",
            value: `${latestLog.exercise?.duration ?? 0} min`,
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            ),
            trend: { value: 0, label: latestLog.exercise?.type || "Activity" },
            variant: "warning" as const,
          },
        ];

        setStats(newStats);

        // Optional: Add real weekly/daily breakdown data handling here
        setWeeklyActivity(null);
        setDailyBreakdown(null);

      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <PageContainer title="Welcome Back!" subtitle="Track your wellness journey">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {!isLoading && stats.length > 0 ? (
            <StatsGrid stats={stats} />
          ) : (
            <p className="text-gray-500">Loading stats...</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {weeklyActivity && dailyBreakdown ? (
            <ActivitySummary
              weeklyActivity={weeklyActivity}
              dailyBreakdown={dailyBreakdown}
            />
          ) : (
            <p className="text-gray-500 col-span-3">Activity summary coming soon...</p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
