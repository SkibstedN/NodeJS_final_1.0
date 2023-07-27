import privateChat from "../models/privatechat.js";
import { Router } from "express";
const router = Router();

router.post("/history", async (req, res) => {
    console.log(req.body);
  const { username, otherUsername } = req.body;
  const existingChat = await privateChat.findOne({
    $or: [
      { user: { username, otherUsername } },
      { user: { username: otherUsername, otherUsername: username } },
    ],
  });
  if(existingChat) { res.status(200).send({ roomId: existingChat.roomId })}
    else{
        const newChat = privateChat({ user:{username}, otherUser:{username:otherUsername} });
        await newChat.save();
        res.status(201).send({ roomId:newChat.roomId });
    }
});

export default router;