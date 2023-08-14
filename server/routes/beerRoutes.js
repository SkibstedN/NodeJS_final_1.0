import dotenv from "dotenv/config";
import User from '../models/User.js';
import { Router } from "express";
const router = Router();

router.get('/beers', async (req, res) => {
    const response = await fetch(
        "https://beers-list.p.rapidapi.com/beers/",
        {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": process.env.BEER_API_KEY,
                "X-RapidAPI-Host": process.env.BEER_API_HOST,
            },
        }
    );
    const data = await response.json();
    const beers = data.filter(
        (beer) =>
            !beer.title.includes("�") && !beer.description.includes("�")
    );
    res.status(200).send(beers);
});

router.get('/beers/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const user = await User.findOne({ username }).populate('beers');

        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        res.status(200).send({ data: user.beers });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
});

router.post('/beers', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({ message: 'Not logged in.' });
    }

    const beerToAdd = req.body;

    try {
        // Find the user by their username
        const user = await User.findOne({ username: req.session.user.username });

        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        // Check if the beer already exists in the user's list (based on title)
        const beerExists = user.beers.some((beer) => beer.title === beerToAdd.title);

        if (beerExists) {
            return res.status(409).send({ message: 'Beer already added to the list.' });
        }

        // Add the new beer to the user's list
        user.beers.push(beerToAdd);
        await user.save();

        res.status(201).send({ message: 'Beer added to the list successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error.' });
    }
});

router.delete('/beers/:username/:beerId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({ message: 'Not logged in.' });
    }

    const username = req.session.user.username;
    const usernameParam = req.params.username;
    if (username !== usernameParam) {
        return res.status(400).send({ message: 'Invalid.' });
    }

    const beerId = req.params.beerId;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        // Find the index of the beer with the given beerId in the user's beers array
        const beerIndex = user.beers.findIndex((beer) => beer._id.toString() === beerId);

        if (beerIndex === -1) {
            return res.status(404).send({ message: 'Beer not found in user\'s list!' });
        }

        // Remove the beer from the user's beers array
        user.beers.splice(beerIndex, 1);

        // Save the updated user object
        await user.save();

        res.status(200).send({ message: 'Beer removed from user\'s list successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;