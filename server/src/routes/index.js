import express from 'express';
import dailyLogsRouter from './daily-logs.js';

const router = express.Router();

router.use('/daily-logs', dailyLogsRouter);

// Add other routes here as needed
// router.use('/journal', journalRouter);
// router.use('/goals', goalsRouter);

export default router;