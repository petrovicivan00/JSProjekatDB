const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    mainActor: { type: String},
    rating: { type: Number, min: 0,max: 10 }
}, { timestamps: true})

module.exports = mongoose.model("Movie", MovieSchema);