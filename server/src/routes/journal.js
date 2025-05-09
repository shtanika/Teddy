import express from 'express';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Create journal entry
router.post('/', async (req, res) => {
  try {
    const { userId, content, mood, tags } = req.body;
    
    if (!userId || !content) {
      return res.status(400).json({ error: 'User ID and content are required' });
    }
    
    const journalEntry = await prisma.journalEntry.create({
      data: {
        id: randomUUID(),
        userId,
        content,
        mood,
        tags: tags || [],
        date: new Date(),
      },
      include: {
        user: true,
      },
    });
    
    res.json(journalEntry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ 
      error: 'Failed to create journal entry',
      details: error.message 
    });
  }
});

// Get all journal entries for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const journalEntries = await prisma.journalEntry.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    res.json(journalEntries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ 
      error: 'Failed to fetch journal entries',
      details: error.message 
    });
  }
});

// Get journal entries within a specific timeframe
router.get('/timeframe', async (req, res) => {
  try {
    const { userId, timeframe } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!timeframe || !['week', 'month', 'year'].includes(timeframe)) {
      return res.status(400).json({ 
        error: 'Valid timeframe is required (week, month, or year)' 
      });
    }
    
    // Calculate the start date based on the timeframe
    const now = new Date();
    let startDate = new Date();
    
    switch (timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    const journalEntries = await prisma.journalEntry.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: now,
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    res.json(journalEntries);
  } catch (error) {
    console.error('Error fetching journal entries by timeframe:', error);
    res.status(500).json({ 
      error: 'Failed to fetch journal entries',
      details: error.message 
    });
  }
});

// Get a specific journal entry by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const journalEntry = await prisma.journalEntry.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    
    if (!journalEntry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    // Security check to ensure users can only access their own entries
    if (journalEntry.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to journal entry' });
    }
    
    res.json(journalEntry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ 
      error: 'Failed to fetch journal entry',
      details: error.message 
    });
  }
});

// Update a journal entry
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, mood, tags } = req.body;
    const userId = req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Check if the entry exists and belongs to the user
    const existingEntry = await prisma.journalEntry.findUnique({
      where: { id },
    });
    
    if (!existingEntry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    if (existingEntry.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to journal entry' });
    }
    
    const updatedEntry = await prisma.journalEntry.update({
      where: { id },
      data: {
        content,
        mood,
        tags,
        updatedAt: new Date(),
      },
      include: {
        user: true,
      },
    });
    
    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ 
      error: 'Failed to update journal entry',
      details: error.message 
    });
  }
});

// Delete a journal entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Check if the entry exists and belongs to the user
    const existingEntry = await prisma.journalEntry.findUnique({
      where: { id },
    });
    
    if (!existingEntry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    if (existingEntry.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized access to journal entry' });
    }
    
    await prisma.journalEntry.delete({
      where: { id },
    });
    
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ 
      error: 'Failed to delete journal entry',
      details: error.message 
    });
  }
});

export default router;