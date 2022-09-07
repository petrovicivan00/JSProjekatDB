const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
    title: { type: String, required: true},
    year: { type: Number, required: true},
    creator: { type: String, required: true} ,
    season: { type: Number},
    episode: { type: Number, required: true },
    rating: { type: Number, min: 0,max: 10 }
}, { timestamps: true})

module.exports = mongoose.model("Anime", AnimeSchema);