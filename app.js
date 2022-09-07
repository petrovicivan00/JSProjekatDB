const express = require("express");
require("dotenv").config();
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");
const Comment = require("./models/Comment");
const verify = require("./helpers/verifyToken");
const { commentSchema } = require('./helpers/validationSchema')
const mongoose = require("mongoose");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const standupRoute = require("./routes/standups");
const showRoute = require("./routes/shows");
const animeRoute = require("./routes/animes");
const commentRoute = require("./routes/comments");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
        credentials: true
    },
    allowEIO3: true
});

var corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
}

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));

app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/standups", standupRoute);
app.use("/api/shows", showRoute);
app.use("/api/animes", animeRoute);
app.use("/api/comments", commentRoute);

io.on('connection', socket => {
    socket.use(verify);
 
    socket.on('comment', msg => {
        const result = commentSchema.validateAsync(msg)
        if(result.error == null){
            const newComment = new Comment(msg);
            try {
                const savedComment = newComment.save();
                io.emit('comment',JSON.stringify(savedComment));
            } catch (err) {
                socket.emit('error', err);
            }
        }else{
            socket.emit('error', err);
        }
    });

    socket.on('error', err => socket.emit('error', err.message) );
});

mongoose.connect('mongodb://localhost:27017/MyMovies')
        .then(() => console.log("DB Connection Successfull"))
        .catch(err => console.log(err));

server.listen( process.env.PORT | 3000, () => {
    console.log("Backend server is running on port " + process.env.PORT);
});