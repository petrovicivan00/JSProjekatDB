const router = require("express").Router();
const Standup = require("../models/Standup");
const verify = require("../helpers/verifyToken");
const { standupSchema } = require('../helpers/validationSchema')

//CREATE
router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin || req.user.isModerator) {
        const result = standupSchema.validateAsync(req.body)
        if(result.error == null){
            const old = await Standup.findOne(req.body);
            if(old){
                res.status(400).json({ message: "Standup already exists!"})
                return;
            }
            const newStandup = new Standup(req.body);
            try {
                const savedStandup = await newStandup.save();
                res.status(201).json(savedStandup);
            } catch (err) {
                res.status(500).json(err);
            }
        }else{
            res.status(403).json("Inputs are not allowed!");
        }
    } else {
        res.status(403).json("You are not allowed to add stand-ups!");
    }
});
//UPDATE
router.put("/:id", verify, async (req, res) => {
    if (req.user.isAdmin || req.user.isModerator) {
        const result = standupSchema.validateAsync(req.body)
        if(result.error == null){
            try {
                const updatedStandup = await Standup.findByIdAndUpdate(
                req.params.id, { $set: req.body }, { new: true });
                res.status(200).json(updatedStandup);
            } catch (err) {
                res.status(500).json(err);
            }
        }else{
        res.status(403).json("Inputs are not allowed!");
    }
    } else {
        res.status(403).json("You are not allowed to update stand-ups!");
    }
});
//DELETE
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin || req.user.isModerator) {
        try {
            await Standup.findByIdAndDelete(req.params.id);
            res.status(200).json("The stand-up has been deleted...");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed to delete stand-ups!");
    }
});

//SEARCH STANDUP
router.get("/find/:title", async (req, res) => {
    try {
        const standup = await Standup.find({title:req.params.title});
        res.status(200).json(standup);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL STANDUPS
router.get("/", async (req, res) => {
        try {
            const standup = await Standup.find();
            res.status(200).json(standup.reverse());
        } catch (err) {
            res.status(500).json(err);
        }
});

module.exports = router;