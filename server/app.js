import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

// Create equivalent of __dirname in ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../client/public')));
app.use('/scripts', express.static(path.join(process.cwd(), 'node_modules')));



app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000, // 1 hour
  },
}));

app.use('/auth', authRoutes);
app.use('/app'pageRoutes);

const connectionString = process.env.MONGODB_CONNECT;
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
