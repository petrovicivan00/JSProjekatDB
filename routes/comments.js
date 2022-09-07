const router = require("express").Router();
const Comment = require("../models/Comment");
const verify = require("../helpers/verifyToken");

//DELETE
router.delete("/:id", verify, async (req, res) => {
        try {
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json("The comment has been deleted...");
        } catch (err) {
            res.status(500).json(err);
        }
});

//GET ALL COMMENTS
router.get("/:id", async (req, res) => {
        try {
            const comments = await Comment.find({object:req.params.id});
            res.status(200).json(comments.reverse());
        } catch (err) {
            res.status(500).json(err);
        }
});

module.exports = router;