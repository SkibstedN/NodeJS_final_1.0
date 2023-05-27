import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import path from 'path';


const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
app.use(express.static(path.join(__dirname, '../client/public')));



app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000, // 1 hour
  },
}));

app.use('/auth', authRoutes);

const connectionString = process.env.MONGODB_CONNECT;
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));


const port = process.env.PORT || 3000;
console.log('Port from .env:', process.env.PORT);
app.listen(port, () => console.log(`Server running on port ${port}`));




