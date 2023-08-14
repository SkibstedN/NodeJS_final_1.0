import dotenv from "dotenv/config";
import express from "express";
const app = express();

app.use(express.json());

import cors from "cors";
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

import http from "http";
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log(`A client connected: ${socket.id}`);

  //User logs in
  socket.on("login", (username) => {
    console.log("Login event received with username: ", username);
    onlineUsers.push(username);
    io.emit("userListChanged", onlineUsers);
  });

  //User sends message
  socket.on("sendMessage", (data) => {
    const { username, message: chatMessage } = data;
    io.emit("receiveMessage", { username, message: chatMessage });
  });

  // Private chat
  // Join the chatroom with the roomId which is shared between the 2 users
  socket.on("joinPrivateChatRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendPrivateMessage", (data) => {
    io.to(data.roomId).emit("privateChatMessage", {
      sender: data.username,
      content: data.messageContent,
    });
  });

  // User logs out
  socket.on("logout", (username) => {
    console.log("logout event received with username: ", username);
    onlineUsers = onlineUsers.filter((user) => user !== username);
    io.emit("userListChanged", onlineUsers);
  });

  // User disconnects
  socket.on("disconnect", () => {
    const username = onlineUsers[socket.id];
    delete onlineUsers[socket.id];
    io.emit("userLogout", username);
  });
});

import session from "express-session";
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);

import authRoutes from "./routes/authRoutes.js";
app.use("/auth", authRoutes);
import privateChatRouter from "./routes/privateChatRouter.js";
app.use("/chat", privateChatRouter);
import userRoutes from "./routes/userRoutes.js";
app.use("/user", userRoutes);
import beerRoutes from "./routes/beerRoutes.js";
app.use(beerRoutes);

const loginRequired = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send({ error: "Unauthorized" });
  }
  next();
};

app.get("/onlineUsers", loginRequired, (req, res) => {
  res.send(onlineUsers);
});

import User from "./models/User.js";
app.get("/api/users", loginRequired, async (req, res) => {
  try {
    const users = await User.find({}); // Fetch all users
    res.status(200).send(users.map((user) => user.username)); // Respond with an array of usernames
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "An error occurred while trying to fetch users." });
  }
});

import mongoose from "mongoose";
const connectionString = process.env.MONGODB_CONNECT;
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Could not connect to MongoDB Atlas", err));

const PORT = process.env.PORT || 3000;
server.listen(PORT, (error) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log("Server is running on port", PORT);
});
