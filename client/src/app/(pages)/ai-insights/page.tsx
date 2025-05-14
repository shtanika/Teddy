'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { authClient } from '@/lib/auth-client';
import PageContainer from '@/components/layout/PageContainer';

interface UserData {
  name: string;
  id: string;
}

export default function AIInsightsPage() {
  const [dailyHabitsInsights, setDailyHabitsInsights] = useState<string | null>(null);
  const [comprehensiveInsights, setComprehensiveInsights] = useState<string | null>(null);
  const [isLoadingDaily, setIsLoadingDaily] = useState(false);
  const [isLoadingComprehensive, setIsLoadingComprehensive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: session } = await authClient.getSession();
      if (session?.user?.name) {
        setUserData({
          name: session.user.name,
          id: session.session.userId,
        });
      }
    };

    fetchUserData();
  }, []);

  const handleGenerateDailyHabitsInsights = async () => {
    if (!userData) return;
    
    setIsLoadingDaily(true);
    setError(null);
    
    try {
      const response = await apiClient.getDailyLogsInsights(userData.id);
      setDailyHabitsInsights(response.insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
      console.error('Error generating daily habits insights:', err);
    } finally {
      setIsLoadingDaily(false);
    }
  };

  const handleGenerateComprehensiveInsights = async () => {
    if (!userData) return;
    
    setIsLoadingComprehensive(true);
    setError(null);
    
    try {
      const response = await apiClient.getComprehensiveInsights(userData.id);
      setComprehensiveInsights(response.insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
      console.error('Error generating comprehensive insights:', err);
    } finally {
      setIsLoadingComprehensive(false);
    }
  };

  return (
    <PageContainer
      title="AI Insights"
      subtitle="Personalized wellness recommendations"
    >
      <div className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Daily Habits Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Daily Habits Insights</h2>
              <p className="text-sm text-gray-500">Analysis based on your daily logs</p>
            </div>
            <button
              onClick={handleGenerateDailyHabitsInsights}
              disabled={isLoadingDaily || !userData}
              className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{isLoadingDaily ? 'Generating...' : 'Generate Insights'}</span>
            </button>
          </div>
          
          {dailyHabitsInsights ? (
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{dailyHabitsInsights}</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Generate insights to see personalized recommendations based on your daily habits.</p>
              <p className="text-sm mt-2">Includes analysis of sleep, activity, and other daily logs.</p>
            </div>
          )}
        </div>

        {/* Comprehensive Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Comprehensive Insights</h2>
              <p className="text-sm text-gray-500">Analysis based on your daily logs and journal entries</p>
            </div>
            <button
              onClick={handleGenerateComprehensiveInsights}
              disabled={isLoadingComprehensive || !userData}
              className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{isLoadingComprehensive ? 'Generating...' : 'Generate Insights'}</span>
            </button>
          </div>
          
          {comprehensiveInsights ? (
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{comprehensiveInsights}</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Generate insights to see a comprehensive analysis of your wellness journey.</p>
              <p className="text-sm mt-2">Combines daily habits with journal entries for deeper insights.</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
