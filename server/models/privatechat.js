import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const PrivateChatSchema = new mongoose.Schema({
  roomId: { type: String, default: uuidv4, unique: true },
  user: {
    username: { type: String, required: true },
  },
  otherUser: {
    username: { type: String, required: true },
  },
  messages: [
    {
      sender: String,
      content: String,
      sentOn: { type: Date, default: Date.now },
    },
  ],
});

const privatechat = mongoose.model("privatechat", PrivateChatSchema);
export default privatechat;
