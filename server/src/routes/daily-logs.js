import express from 'express';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Create daily log
router.post('/', async (req, res) => {
  try {
    const { userId, mood, steps, stepsGoal, sleep, exercise } = req.body;    
    const dailyLog = await prisma.dailyLog.create({
      data: {
        id: randomUUID(),
        userId, // This connects to the User model
        date: new Date(),
        mood,
        steps,
        stepsGoal,
        sleep: {
          create: {
            id: randomUUID(),
            duration: sleep.duration,
            quality: sleep.quality,
            sleepGoal: sleep.sleepGoal,
          },
        },
        exercises: {
          create: {
            id: randomUUID(),
            type: exercise.type,
            customType: exercise.customType,
            duration: exercise.duration,
            intensity: exercise.intensity,
          },
        },
      },
      include: {
        user: true, // Include the user relation
        sleep: true,
        exercises: true,
      },
    });

    res.json(dailyLog);
  } catch (error) {
    console.error('Error creating daily log:', error);
    res.status(500).json({ 
      error: 'Failed to create daily log',
      details: error.message 
    });
  }
});

// Get user's daily logs
router.get('/', async (req, res) => {
  try {
    const dailyLogs = await prisma.dailyLog.findMany({
      where: {
        userId: req.user.id,
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
    res.status(500).json({ error: 'Failed to fetch daily logs' });
  }
});

export default router;
