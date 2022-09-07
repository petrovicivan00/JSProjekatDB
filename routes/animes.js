const router = require("express").Router();
const Anime = require("../models/Anime");
const verify = require("../helpers/verifyToken");
const { animeSchema } = require('../helpers/validationSchema')

//CREATE
router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin || req.user.isModerator) {
        const result = animeSchema.validateAsync(req.body)
        if(result.error == null){
            const old = await Anime.findOne(req.body);
            if(old){
                res.status(400).json({ message: "Anime already exists!"})
                return;
            }
            const newAnime = new Anime(req.body);
            try {
                const savedAnime = await newAnime.save();
                res.status(201).json(savedAnime);
            } catch (err) {
                res.status(500).json(err);
            }
        }else{
            res.status(403).json("Inputs are not allowed!");
        }
    } else {
        res.status(403).json("You are not allowed to add animes!");
    }
});
//UPDATE
router.put("/:id", verify, async (req, res) => {
    
    if (req.user.isAdmin || req.user.isModerator) {
        const result = animeSchema.validateAsync(req.body)
        if(result.error == null){
        try {
            const updatedAnime = await Anime.findByIdAndUpdate(
                req.params.id, { $set: req.body }, { new: true }
            );
            res.status(200).json(updatedAnime);
        } catch (err) {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("Inputs are not allowed!");
    }
    } else {
        res.status(403).json("You are not allowed to update animes!");
    }
});
//DELETE
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin || req.user.isModerator) {
        try {
            await Anime.findByIdAndDelete(req.params.id);
            res.status(200).json("The anime has been deleted...");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed to delete animes!");
    }
});

//SEARCH ANIME
router.get("/find/:title", async (req, res) => {
    try {
        const anime = await Anime.find({title:req.params.title});
        res.status(200).json(anime);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL ANIMES
router.get("/", async (req, res) => {
        try {
            const animes = await Anime.find();
            res.status(200).json(animes.reverse());
        } catch (err) {
            res.status(500).json(err);
        }
});

module.exports = router;