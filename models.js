const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

let movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    genre: {
        name: String,
        description: String
    },
    director: {
        name: String,
        bio: String,
        birthyear: String,
        gender: String,
    },
    imagePath: String,
    featured: Boolean,
    year: String,
});

let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    bday: Date,
    password: {type: String, required: true},
    email: {type: String, required: true}, 
    favMovies: [{type: mongoose.Schema.Types.ObjectId, ref: "Movie"}],
});
// hashed PW func:
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};
 // validate PW func: 
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
  

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

//CREATING MODELS and XPORT 2 index.js

module.exports.Movie = Movie;
module.exports.User = User;