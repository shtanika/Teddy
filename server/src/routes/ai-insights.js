import express from 'express';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const prisma = new PrismaClient();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Helper function to format daily logs for AI prompt
const formatDailyLogsForAI = (dailyLogs) => {
  return dailyLogs.map(log => {
    return {
      date: log.date,
      mood: log.mood,
      sleep: log.sleep ? {
        duration: log.sleep.duration,
        quality: log.sleep.quality,
        sleepGoal: log.sleep.sleepGoal
      } : null,
      exercise: log.exercises ? {
        type: log.exercises.type,
        duration: log.exercises.duration,
        intensity: log.exercises.intensity
      } : null
    };
  });
};

// Helper function to format journal entries for AI prompt
const formatJournalEntriesForAI = (journalEntries) => {
  return journalEntries.map(entry => {
    return {
      date: entry.date,
      mood: entry.mood,
      content: entry.content,
      tags: entry.tags
    };
  });
};

// Get insights based on daily logs only
router.get('/daily-logs', async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Fetch user's daily logs from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyLogs = await prisma.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        sleep: true,
        exercises: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    if (dailyLogs.length === 0) {
      return res.status(404).json({ 
        error: 'No daily logs found for analysis',
        message: 'Please log your daily activities for at least a few days to receive insights.'
      });
    }
    
    // Format data for AI
    const formattedData = formatDailyLogsForAI(dailyLogs);
    
    // Create prompt for Gemini
    const prompt = `
      You are a wellness insights assistant for the Teddy wellness app. 
      Analyze the following daily logs data and provide personalized wellness insights, trends, and recommendations.
      Your response should be 1-3 paragraphs long, focusing on the most important patterns and actionable advice.
      Be supportive, encouraging, and personalized in your analysis.
      
      Daily logs data (last 30 days):
      ${JSON.stringify(formattedData, null, 2)}
      
      Provide insights on:
      1. Sleep patterns and quality
      2. Exercise habits and consistency
      3. Mood trends and potential correlations
      4. Steps and activity levels
      5. Specific, actionable recommendations for improvement
    `;
    
    // Generate insights with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();
    
    res.json({ insights });
  } catch (error) {
    console.error('Error generating AI insights from daily logs:', error);
    res.status(500).json({ 
      error: 'Failed to generate insights',
      details: error.message 
    });
  }
});

// Get comprehensive insights based on both daily logs and journal entries
router.get('/comprehensive', async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Fetch user's data from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Get daily logs
    const dailyLogs = await prisma.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        sleep: true,
        exercises: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    // Get journal entries
    const journalEntries = await prisma.journalEntry.findMany({
      where: {
        userId,
        date: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    if (dailyLogs.length === 0 && journalEntries.length === 0) {
      return res.status(404).json({ 
        error: 'No data found for analysis',
        message: 'Please log your daily activities and journal entries for at least a few days to receive insights.'
      });
    }
    
    // Format data for AI
    const formattedDailyLogs = formatDailyLogsForAI(dailyLogs);
    const formattedJournalEntries = formatJournalEntriesForAI(journalEntries);
    
    // Create prompt for Gemini
    const prompt = `
      You are a wellness insights assistant for the Teddy wellness app. 
      Analyze the following user data and provide personalized wellness insights, trends, and recommendations.
      Your response should be 1-3 paragraphs long, focusing on the most important patterns and actionable advice.
      Be supportive, encouraging, and personalized in your analysis.
      
      Daily logs data (last 30 days):
      ${JSON.stringify(formattedDailyLogs, null, 2)}
      
      Journal entries (last 30 days):
      ${JSON.stringify(formattedJournalEntries, null, 2)}
      
      Provide comprehensive insights on:
      1. Sleep patterns and quality
      2. Exercise habits and consistency
      3. Mood trends and potential correlations with activities or events mentioned in journal entries
      4. Steps and activity levels
      5. Emotional well-being based on journal content
      6. Specific, actionable recommendations for improvement
      7. Potential connections between physical activities and mental state
    `;
    
    // Generate insights with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();
    
    res.json({ insights });
  } catch (error) {
    console.error('Error generating comprehensive AI insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate insights',
      details: error.message 
    });
  }
});

export default router;