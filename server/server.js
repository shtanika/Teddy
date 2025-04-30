import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./src/lib/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // NextJS client URL
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev')); // Logging

// Mount Better Auth handler before express.json middleware
app.all("/api/auth/*", toNodeHandler(auth));

// Mount express json middleware after Better Auth handler
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
