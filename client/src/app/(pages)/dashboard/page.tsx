'use client';

import { StatsGrid } from "@/components/features/dashboard/StatsGrid";
import { ActivitySummary } from "@/components/features/dashboard/ActivitySummary";
import PageContainer from "@/components/layout/PageContainer";

// Mock data - In a real app, this would come from an API or database
const mockStats = [
    {
      title: "Steps",
      value: "2,500",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      trend: { value: 12, label: "Daily Goal: 10,000" },
      variant: "success" as const,
    },
    {
      title: "Mood",
      value: "Happy",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      trend: { value: 8, label: "Better than yesterday" },
      variant: "success" as const,
    },
    {
      title: "Sleep",
      value: "7.5 hrs",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      trend: { value: -5, label: "Goal: 8 hrs" },
      variant: "warning" as const,
    },
    {
      title: "Exercise",
      value: "45 min",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      trend: { value: 15, label: "Goal: 60 min" },
      variant: "warning" as const,
    },
  ];
  
  const mockWeeklyActivity = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Steps",
        data: [6000, 8000, 7500, 8500, 8200, 9000, 8234],
      },
    ],
  };
  
  const mockDailyBreakdown = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Exercise Time",
        data: [45, 60, 30, 45, 60, 75, 45],
      },
    ],
  };
  
export default function DashboardPage() {
  return (
    <PageContainer 
      title="Welcome Back!"
      subtitle="Track your wellness journey"
    >
      <div className="space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <StatsGrid stats={mockStats} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <ActivitySummary
            weeklyActivity={mockWeeklyActivity}
            dailyBreakdown={mockDailyBreakdown}
          />
        </div>
      </div>
    </PageContainer>
  );
} 