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
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

connectToDatabase()
    .then(() => {
        mongoose.connection.on('connected', () => {
            console.log('Mongoose default connection open');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose default connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose default connection disconnected');
        });

        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB and start server:", err);
        process.exit(1);
    });

process.on('SIGINT', async () => {
    console.log('SIGINT received. Closing Mongoose connection...');
    await mongoose.connection.close();
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
});