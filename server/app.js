import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import http from "http";
import { Server } from "socket.io";
import User from './models/User.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create equivalent of __dirname in ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../client/public')));
app.use('/scripts', express.static(path.join(process.cwd(), 'node_modules')));  // Is this good practice - you can see node-modules

const server = http.createServer(app);
const io = new Server(server);
// let onlineUsers = {};
let onlineUsers = [];

io.on("connection", (socket) => {
    console.log(`A client connected: ${socket.id}`);
    io.emit('userListChanged');

  
    // User logs in
    socket.on("login", (username) => {
        console.log("login event received with username: ", username);
        onlineUsers.push(username);
        // io.emit("userLogin", username);
        io.emit('userListChanged');

    });
  
    // User sends message
    socket.on("sendMessage", (data) => {
        const { username, message: chatMessage } = data;
        io.emit("receiveMessage", { username, message: chatMessage });
    });
  
    // User logs out
    socket.on("logout", (username) => {
        console.log("logout event received with username: ", username);
        onlineUsers = onlineUsers.filter(user => user !== username);
        // username = onlineUsers[socket.id];
        // delete onlineUsers[socket.id];
        io.emit('userListChanged', onlineUsers);
        // io.emit("userLogout", username);
    });
  
    // User disconnects
    socket.on("disconnect", () => {
        const username = onlineUsers[socket.id];
        delete onlineUsers[socket.id];
        io.emit("userLogout", username);
    });
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000, // 1 hour
  },
}));

app.use('/auth', authRoutes);
app.use('/app', pageRoutes);

app.get('/app/onlineUsers', (req, res) => {
  // Return online users
  res.json(onlineUsers);
});

app.get('/onlineUsers', (req, res) => {
  res.json(onlineUsers);
});

const loginRequired = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};


app.get('/api/users', loginRequired, async (req, res) => {
  try {
    const users = await User.find({});  // Fetch all users
    res.json(users.map(user => user.username));  // Respond with an array of usernames
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while trying to fetch users.' });
  }
});


const connectionString = process.env.MONGODB_CONNECT;
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));
