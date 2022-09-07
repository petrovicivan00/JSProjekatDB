const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../helpers/verifyToken");
const { movieSchema } = require('../helpers/validationSchema')

//CREATE
router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin || req.user.isModerator) {
        const result = movieSchema.validateAsync(req.body)
        if(result.error == null){
            const old = await Movie.findOne( req.body );
            if(old){
                res.status(400).json({ message: "Movie already exists!"})
                return;
            }
            const newMovie = new Movie(req.body);
            try {
                const savedMovie = await newMovie.save();
                res.status(201).json(savedMovie);
            } catch (err) {
                res.status(500).json(err);
            }
        }else{
            res.status(403).json("Inputs are not allowed!");
        }
    } else {
        res.status(403).json("You are not allowed to add movies!");
    }
});
//UPDATE
router.put("/:id", verify, async (req, res) => {
    if (req.user.isAdmin || req.user.isModerator) {
        const result = movieSchema.validateAsync(req.body)
        if(result.error == null){
            try {
                const updatedMovie = await Movie.findByIdAndUpdate(
                req.params.id, { $set: req.body }, { new: true });
                res.status(200).json(updatedMovie);
            } catch (err) {
                res.status(500).json(err);
            }
        }else{
        res.status(403).json("Inputs are not allowed!");
    }
    } else {
        res.status(403).json("You are not allowed to update movies");
    }
});
//DELETE
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin || req.user.isModerator) {
        try {
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json("The movie has been deleted...");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed to delete movies!");
    }
});

//SEARCH MOVIE
router.get("/find/:title", async (req, res) => {
    try {
        const movie = await Movie.find({title:req.params.title});
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL MOVIES
router.get("/", async (req, res) => {
        try {
            const movies = await Movie.find();
            res.status(200).json(movies.reverse());
        } catch (err) {
            res.status(500).json(err);
        }
});

module.exports = router;