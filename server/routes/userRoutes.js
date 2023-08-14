import User from '../models/User.js';
import { Router } from "express";
const router = Router();

router.get("/profile/:username", async (req, res) => {
    if (!req.session.user) {
        return res.status(404).send({ message: "Need to be logged in!" });
    }
    const username = req.params.username;

    const user = await User.findOne({ username }).select("username email");
    if (!user) {
        return res.status(404).send({ message: "User not found!" });
    }

    // If user is found, send the user information back as the response
    res.status(200).send({ data: user });
});

export default router;