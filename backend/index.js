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
import cors from "cors"; // No need for mongoose import here

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // PORT will be ignored by Vercel for serverless functions

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// const __filename = fileURLToPath(import.meta.url); // Not directly needed unless you are resolving paths relative to this file
// const __dirname = path.dirname(__filename); // Not directly needed

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/genre', genreRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/upload', uploadRoutes);

// --- Basic Home Route (Optional) ---
app.get('/', (req, res) => {
    res.send('API is running...');
});

// --- Static File Serving ---
// !!! IMPORTANT: This will NOT work on Vercel for user uploads.
// User-uploaded files need to be stored in a persistent cloud storage (S3, Cloudinary, etc.).
// For now, comment it out to get the basic API working.
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Connect to database only once when the function initializes (cold start)
// You might want to move this connection logic into a separate file/function
// that is called once, or ensure connectToDatabase() handles existing connections.
connectToDatabase(); // Call the function to connect

// EXPORT THE APP for Vercel
export default app; // For ES Modules