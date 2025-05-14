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
      } else {
        // Set the message only if user is not authenticated
        setResult('Please sign in first');
      }
    };

    fetchUserData();
  }, []);

  const handleTestCreateDailyLog = async () => {
    if (!userData) {
      setResult('Please sign in first');
      return;
    }

    setIsLoading(true);
    
    const mockDailyLogData = {
      userId: userData.id,
      user: userData.user,
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
    
    try {
      const response = await apiClient.createDailyLog(mockDailyLogData);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestGetDailyLogs = async () => {
    if (!userData) {
      setResult('Please sign in first');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiClient.getDailyLogs(userData.id);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCreateMinimalDailyLog = async () => {
    if (!userData) {
      setResult('Please sign in first');
      return;
    }

    setIsLoading(true);
    
    const minimalDailyLogData = {
      userId: userData.id,
      user: userData.user,
      mood: 3,
      // Omitting steps, stepsGoal, sleep, and exercise to test minimal data
    };
    
    try {
      const response = await apiClient.createDailyLog(minimalDailyLogData);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
        
    const mockJournalData = {
      userId: userData.id,
      content: "Today was a productive day. I managed to complete all my tasks and even had time for a short walk in the evening.",
      mood: "happy",
      tags: ["productive", "work", "exercise"]
    };
    
    try {
      const response = await apiClient.createJournalEntry(mockJournalData);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestGetJournalEntries = async () => {
    if (!userData) {
      setResult('Please sign in first');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiClient.getJournalEntries(userData.id);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestGetWeeklyJournalEntries = async () => {
    if (!userData) {
      setResult('Please sign in first');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiClient.getJournalEntriesByTimeframe(userData.id, 'week');
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
      
      {userData ? (
        <div className="mb-4 p-4 bg-green-50 rounded-lg">
          <p>Signed in as: <strong>{userData.user}</strong></p>
          <p>User ID: <code className="bg-gray-100 px-2 py-1 rounded">{userData.id}</code></p>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
          <p>Not signed in. Please sign in to test the API.</p>
        </div>
      )}
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">Daily Logs</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleTestCreateDailyLog}
              disabled={isLoading || !userData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Create Test Daily Log'}
            </button>
            
            <button
              onClick={handleTestGetDailyLogs}
              disabled={isLoading || !userData}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Get Daily Logs'}
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Journal Entries</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleTestCreateJournalEntry}
              disabled={isLoading || !userData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Create Journal Entry'}
            </button>
            
            <button
              onClick={handleTestGetJournalEntries}
              disabled={isLoading || !userData}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Get All Journal Entries'}
            </button>

            <button
              onClick={handleTestGetWeeklyJournalEntries}
              disabled={isLoading || !userData}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Get Weekly Journal Entries'}
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Daily Logs</h2>
          <div className="flex space-x-4 flex-wrap gap-y-2">
            <button
              onClick={handleTestCreateDailyLog}
              disabled={isLoading || !userData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Create Test Daily Log'}
            </button>
            
            <button
              onClick={handleTestCreateMinimalDailyLog}
              disabled={isLoading || !userData}
              className="bg-blue-300 hover:bg-blue-400 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Create Minimal Daily Log'}
            </button>
            
            <button
              onClick={handleTestGetDailyLogs}
              disabled={isLoading || !userData}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Get Daily Logs'}
            </button>
          </div>
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
