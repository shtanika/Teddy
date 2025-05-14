type DailyLogData = {
  userId: string;
  mood?: number;
  steps?: number;
  stepsGoal?: number;
  sleep?: {
    duration: number;
    quality?: string;
    sleepGoal?: number;
  };
  exercise?: {
    type?: string;
    customType?: string;
    duration: number;
    intensity?: string;
  };
};

type JournalEntryData = {
  userId: string;
  content: string;
  mood?: string;
  tags?: string[];
};

type TimeframeOption = 'week' | 'month' | 'year';

export const apiClient = {
  // Daily Log methods
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

  // Journal methods
  createJournalEntry: async (data: JournalEntryData) => {
    const response = await fetch('/api/journal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.details || responseData.error || 'Failed to create journal entry');
    }

    return responseData;
  },

  getJournalEntries: async (userId: string) => {
    const response = await fetch(`/api/journal?userId=${encodeURIComponent(userId)}`, {
      credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.details || responseData.error || 'Failed to fetch journal entries');
    }

    return responseData;
  },

  getJournalEntriesByTimeframe: async (userId: string, timeframe: TimeframeOption) => {
    const response = await fetch(`/api/journal/timeframe?userId=${encodeURIComponent(userId)}&timeframe=${timeframe}`, {
      credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.details || responseData.error || 'Failed to fetch journal entries');
    }

    return responseData;
  },

  getJournalEntry: async (id: string, userId: string) => {
    const response = await fetch(`/api/journal/${id}?userId=${encodeURIComponent(userId)}`, {
      credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.details || responseData.error || 'Failed to fetch journal entry');
    }

    return responseData;
  },

  updateJournalEntry: async (id: string, data: JournalEntryData) => {
    const response = await fetch(`/api/journal/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.details || responseData.error || 'Failed to update journal entry');
    }

    return responseData;
  },

  deleteJournalEntry: async (id: string, userId: string) => {
    const response = await fetch(`/api/journal/${id}?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.details || responseData.error || 'Failed to delete journal entry');
    }

    return responseData;
  },

  // AI Insights methods
  getDailyLogsInsights: async (userId: string) => {
    const response = await fetch(`/api/ai-insights/daily-logs?userId=${encodeURIComponent(userId)}`, {
      credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.details || responseData.error || responseData.message || 'Failed to fetch AI insights');
    }

    return responseData;
  },

  getComprehensiveInsights: async (userId: string) => {
    const response = await fetch(`/api/ai-insights/comprehensive?userId=${encodeURIComponent(userId)}`, {
      credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.details || responseData.error || responseData.message || 'Failed to fetch comprehensive AI insights');
    }

    return responseData;
  },
};
