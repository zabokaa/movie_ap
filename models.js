const mongoose = require('mongoose');

let movieSchema = mongoos.Schema({
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
        gender: String
    },
    actors: [String],
    imagePath: String,
    featured: Boolean,
    year: Date
});

let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: mongoose.Mixed, required: true},
    bday: Date,
    favMovies: [{type: mongoose.Schema.Types.ObjectId, ref: "Movie"}]
});

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

//CREATING MODELS and XPORT 2 index.js

module.exports.Movie = Movie;
module.exports.User = User;