const mongoose = require("mongoose");

let moviesSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    genre: {
        name: String,
        description: String
    },
    director: {
        name: String,
        bio: String,
        birthyear: Date,
        gender: String,
    },
    actors: [String],
    imagePath: String,
    featured: Boolean,
    year: Date,
});

let usersSchema = mongoose.Schema({
    _id: {type: String},
    username: {type: String, required: true},
    bday: Date,
    password: {type: String, required: true},
    email: {type: String, required: true}, 
    favMovies: [{type: mongoose.Schema.Types.ObjectId, ref: "Movie"}],
});

let Movie = mongoose.model("Movie", moviesSchema);
let User = mongoose.model("User", usersSchema);

//CREATING MODELS and XPORT 2 index.js

module.exports.Movie = Movie;
module.exports.User = User;