type DailyLogData = {
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

    if (!response.ok) {
      throw new Error('Failed to create daily log');
    }

    return response.json();
  },

  getDailyLogs: async () => {
    const response = await fetch('/api/daily-logs', {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch daily logs');
    }

    return response.json();
  },
};