type DailyLogData = {
  userId: string;
  mood: number;
  steps: number;
  stepsGoal?: number;
  sleep: {
    duration: number;
    quality?: string;
    sleepGoal?: number;
  };
  exercise: {
    type?: string;
    customType?: string;
    duration: number;
    intensity?: string;
  };
};

export const apiClient = {
  createDailyLog: async (data: DailyLogData) => {
    const response = await fetch('/api/daily-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.details || responseData.error || 'Failed to create daily log');
    }

    return responseData;
  },

  getDailyLogs: async (userId: string) => {
    const response = await fetch(`/api/daily-logs?userId=${encodeURIComponent(userId)}`, {
      credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.details || responseData.error || 'Failed to fetch daily logs');
    }

    return responseData;
  },
};
