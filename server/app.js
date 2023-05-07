import express from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import bcrypt from 'bcrypt';


const app = express();
dotenv.config();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  }));
  

const connectionString = process.env.MONGODB_CONNECT;

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));


