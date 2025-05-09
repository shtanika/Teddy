import express from 'express';
import dailyLogsRouter from './daily-logs.js';
import journalRouter from './journal.js';

const router = express.Router();

router.use('/daily-logs', dailyLogsRouter);
router.use('/journal', journalRouter);

// Add other routes here as needed
// router.use('/goals', goalsRouter);

export default router;
