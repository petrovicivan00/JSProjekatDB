const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
    title: { type: String, required: true},
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    season: { type: Number, required: true },
    episode: { type: Number, required: true },
    rating: { type: Number, min: 0,max: 10 }
}, { timestamps: true})

module.exports = mongoose.model("Show", ShowSchema);