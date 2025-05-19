import express from 'express';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Helper to remove undefined fields from an object
function removeUndefinedFields(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
}

// Create or update daily log (only one per user per day)
router.post('/', async (req, res) => {
  try {
    const { userId, mood, sleep, exercises } = req.body;

    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Find existing daily log for user for today
    const existingLog = await prisma.dailyLog.findFirst({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        sleep: true,
        exercises: true,
      },
    });

    // Prepare data object with possible fields
    let dailyLogData = {
      mood,
    };

    // Remove any undefined keys to prevent Prisma errors
    dailyLogData = removeUndefinedFields(dailyLogData);

    // Add sleep data if provided
    if (sleep) {
      dailyLogData.sleep = {
        create: {
          id: randomUUID(),
          duration: sleep.duration,
          quality: sleep.quality,
          sleepGoal: sleep.sleepGoal,
        },
      };
    }

    // Add exercise data if provided
    if (exercises && exercises.create && Array.isArray(exercises.create)) {
  dailyLogData.exercises = {
    create: exercises.create.map((ex) => ({
      id: randomUUID(),
      type: ex.type,
      customType: ex.customType || null,
      duration: ex.duration,
      intensity: ex.intensity,
    })),
  };
}

    if (existingLog) {
      // Delete associated sleep/exercise records if they exist
      if (existingLog.sleep && existingLog.sleep.length > 0) {
        await prisma.sleepLog.deleteMany({
          where: { dailyLogId: existingLog.id },
        });
      }

      if (existingLog.exercises && existingLog.exercises.length > 0) {
        await prisma.exerciseLog.deleteMany({
          where: { dailyLogId: existingLog.id },
        });
      }

      // Update existing log
      const updatedLog = await prisma.dailyLog.update({
        where: { id: existingLog.id },
        data: dailyLogData,
        include: {
          user: true,
          sleep: true,
          exercises: true,
        },
      });

      return res.status(200).json(updatedLog);
    }

    // If no log exists, create a new one
    const newLogData = {
      id: randomUUID(),
      userId,
      date: new Date(),
      ...dailyLogData,
    };

    const newLog = await prisma.dailyLog.create({
      data: newLogData,
      include: {
        user: true,
        sleep: true,
        exercises: true,
      },
    });

    res.status(201).json(newLog);
  } catch (error) {
    console.error('Error creating/updating daily log:', error);
    res.status(500).json({
      error: 'Failed to create or update daily log',
      details: error.message,
    });
  }
});

// Get user's daily logs
router.get('/', async (req, res) => {
  try {
    // Extract userId from query parameters or request body
    const userId = req.query.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const dailyLogs = await prisma.dailyLog.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        sleep: true,
        exercises: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(dailyLogs);
  } catch (error) {
    console.error('Error fetching daily logs:', error);
    res.status(500).json({
      error: 'Failed to fetch daily logs',
      details: error.message,
    });
  }
});

export default router;