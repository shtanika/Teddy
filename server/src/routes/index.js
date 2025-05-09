import express from 'express';
import dailyLogsRouter from './daily-logs.js';
import journalRouter from './journal.js';
import aiInsightsRouter from './ai-insights.js';

const router = express.Router();

router.use('/daily-logs', dailyLogsRouter);
router.use('/journal', journalRouter);
router.use('/ai-insights', aiInsightsRouter);

// Add other routes here as needed
// router.use('/goals', goalsRouter);

export default router;
