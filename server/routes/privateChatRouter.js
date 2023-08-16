import privateChat from "../models/privatechat.js";
import { Router } from "express";
const router = Router();

router.post("/private", async (req, res) => {
  const { username, otherUsername } = req.body;
  const existingChat = await privateChat.findOne({
    $or: [
      { "user.username": username, "otherUser.username": otherUsername },
      { "user.username": otherUsername, "otherUser.username": username },
    ],
  });
  if (existingChat) {
    res
      .status(200)
      .send({
        roomId: existingChat.roomId,
        chatHistory: existingChat.messages,
      });
  } else {
    const newChat = privateChat({
      user: { username },
      otherUser: { username: otherUsername },
    });
    await newChat.save();
    res.status(201).send({ roomId: newChat.roomId });
  }
});

router.get("/message/:roomId", async (req, res) => {
  const roomId = req.params.roomId || "";
  try {
    // Find the chat based on the roomId
    const existingChat = await privateChat.findOne({ roomId });

    if (existingChat) {
      res.status(200).send({ chatHistory: existingChat.messages });
    } else {
      res.status(404).send("Chat room not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.post("/message", async (req, res) => {
  const { roomId, username, messageContent } = req.body;

  try {
    // Find the chat based on the roomId
    const existingChat = await privateChat.findOne({ roomId });

    if (existingChat) {
      // Add the new message to the chat history
      existingChat.messages.push({
        sender: username,
        content: messageContent,
        sentOn: new Date(),
      });

      await existingChat.save();
      res
        .status(200)
        .send({
          roomId: existingChat.roomId,
          chatHistory: existingChat.messages,
        });
    } else {
      res.status(404).send("Chat room not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

export default router;
