import express from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const app = express();
dotenv.config();

const connectionString = process.env.MONGODB_CONNECT;

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));


