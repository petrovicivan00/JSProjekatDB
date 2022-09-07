const router = require("express").Router();
const Show = require("../models/Show");
const verify = require("../helpers/verifyToken");
const { showSchema } = require('../helpers/validationSchema')

//CREATE
router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin || req.user.isModerator) {
        const result = showSchema.validateAsync(req.body)
        if(result.error == null){
            const old = await Show.findOne(req.body);
            if(old){
                res.status(400).json({ message: "Show already exists!"})
                return;
            }
            const newShow = new Show(req.body);
            try {
                const savedShow = await newShow.save();
                res.status(201).json(savedShow);
            } catch (err) {
                res.status(500).json(err);
            }
        }else{
            res.status(403).json("Inputs are not allowed!");
        }
    } else {
        res.status(403).json("You are not allowed to add shows!");
    }
});
//UPDATE
router.put("/:id", verify, async (req, res) => {
    if (req.user.isAdmin || req.user.isModerator) {
        const result = showSchema.validateAsync(req.body)
        if(result.error == null){
        try {
            const updatedShow = await Show.findByIdAndUpdate(
                req.params.id, { $set: req.body }, { new: true }
            );
            res.status(200).json(updatedShow);
        } catch (err) {
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("Inputs are not allowed!");
    }
    } else {
        res.status(403).json("You are not allowed to update shows!");
    }
});
//DELETE
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin || req.user.isModerator) {
        try {
            await Show.findByIdAndDelete(req.params.id);
            res.status(200).json("The show has been deleted...");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed to delete shows!");
    }
});

//SEARCH SHOW
router.get("/find/:title", async (req, res) => {
    try {
        const show = await Show.find({title:req.params.title});
        res.status(200).json(show);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL SHOWS
router.get("/", async (req, res) => {
        try {
            const shows = await Show.find();
            res.status(200).json(shows.reverse());
        } catch (err) {
            res.status(500).json(err);
        }
});

module.exports = router;