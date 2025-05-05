'use client';

import { apiClient } from '@/lib/api-client';
import { authClient } from '@/lib/auth-client';
import { useEffect, useState } from 'react';

interface UserData {
  user: string;
  id: string;
}

const TestPage = () => {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: session, error } = await authClient.getSession();
      console.log(session);
      if (session?.user?.name) {
        setUserData({
          user: session.user.name,
          id: session.session.userId,
        });
      }
    };

    fetchUserData();
  }, []);

  const mockDailyLogData = {
    userId: userData?.id,
    user: userData?.user,
    mood: 4,
    steps: 8000,
    stepsGoal: 10000,
    sleep: {
      duration: 7.5,
      quality: 'good',
      sleepGoal: 8,
    },
    exercise: {
      type: 'running',
      duration: 30,
      intensity: 'moderate',
    },
  };

  const handleTestCreateDailyLog = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.createDailyLog(mockDailyLogData);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="space-y-6">
        <div>
          <button
            onClick={handleTestCreateDailyLog}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Test Daily Log'}
          </button>
        </div>

        {result && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Result:</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;