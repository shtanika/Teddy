import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./src/lib/auth.js";
import routes from './src/routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL, // NextJS client URL
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev')); // Logging

// Auth routes
app.all("/api/auth/*", toNodeHandler(auth));

// Parse JSON bodies
app.use(express.json());

// API routes
app.use('/api', routes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
