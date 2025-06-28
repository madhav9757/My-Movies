// server.js or index.js

import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import uploadRoutes from './routes/uploadRoutes.js';
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cookieParser());

// --- CORS Setup ---
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// --- Middleware ---
app.use(express.json({limit: '10mb'})); 
app.use(express.urlencoded({ extended: true, limit: '10mb', parameterLimit: 10000 }));
app.use(cookieParser());

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/genre', genreRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/upload', uploadRoutes);

// --- Base Route ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.use('/uploads', express.static('uploads'));

// --- Connect to DB ---
connectToDatabase();

// --- Export for Vercel ---
export default app;

// --- Run Locally Only ---
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running locally at http://localhost:${PORT}`);
  });
}
