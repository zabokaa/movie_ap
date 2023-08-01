const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
//to allow cross-origin requests:
const cors = require("cors");
/**
 * @typedef {Object} Movie
 * @property {string} title - The title of the movie.
 * @property {string} genre - The genre of the movie.
 * @property {string} director - The name of the movie's director.
 */

/**
 * @typedef {Object} User
 * @property {string} username - The username of the user.
 * @property {string} email - The email address of the user.
 * @property {string} bday - The birthdate of the user.
 * @property {string[]} favMovies - An array of movie IDs representing favorite movies of the user.
 */

/**
 * @typedef {Object} UserModel
 * @property {Function} hashPassword - A function to hash the password.
 * @property {Function} findOne - A function to find a user in the database.
 * @property {Function} create - A function to create a new user in the database.
 * @property {Function} findOneAndUpdate - A function to find and update a user in the database.
 * @property {Function} findOneAndRemove - A function to find and remove a user from the database.
 */
//INTEGRATING mongoose w/ rest api
const app = express();

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

// CONNECTING to mongodbAtlas w/ ENV VAR:
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 
app.use(cors()); // Enable CORS for all routes

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));

// Importing auth + passport file 
const auth = require("./auth.js")(app);
const passport = require("passport");
require("./passport.js");
// and initalize passport:
app.use(passport.initialize());

// server-sdie validation:
const {check, validationResult} = require("express-validator");

/**
 * @route POST /users
 * @group Users - Operations related to users.
 * @param {User} request.body.required - The user information to create a new user.
 * @returns {User} 201 - The created user.
 * @returns {Error} 422 - Validation error.
 * @returns {Error} 500 - Internal server error.
 */
app.post("/users", 
  [
    check("username", "username is required").not().isEmpty(),
    check("username", "alphanumeric characters are not allowed").isAlphanumeric(),
    check("password", "password is required").not().isEmpty(),
    check("email", "invalid email address").isEmail().normalizeEmail(),
  ],
  (req, res) => {
    // checking for errors:
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    
    let hashedPassword = Users.hashPassword(req.body.password);
    Users.findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.username + " already exists");
        } else {
          const newUser = {
            username: req.body.username,
            email: req.body.email,
            bday: req.body.bday,
            favMovies: req.body.favMovies
          };

          // Save the hashed password only if it's not empty
          if (hashedPassword) {
            newUser.password = hashedPassword;
          }

          Users.create(newUser)
            .then((createdUser) => {
              // Exclude the password from the response
              const userResponse = {
                _id: createdUser._id,
                username: createdUser.username,
                email: createdUser.email,
                bday: createdUser.bday,
                favMovies: createdUser.favMovies
              };

              res.status(201).json(userResponse);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("error: " + error);
      });
});


/**
 * @route POST /users/:username/favMovies/:movieID
 * @group Users - Operations related to users.
 * @param {string} username.path.required - The username of the user.
 * @param {string} movieID.path.required - The ID of the movie to add to favorites.
 * @returns {User} 200 - The updated user with the added favorite movie.
 * @returns {Error} 404 - User not found error.
 * @returns {Error} 500 - Internal server error.
 */
app.post("/users/:username/favMovies/:movieID", passport.authenticate("jwt", {session: false}), (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    { $push: { favMovies: req.params.movieID } },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send("error: user not found :/");
      } else {
        res.json(updatedUser);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("error: " + err);
    });
});


app.get("/", (req, res) => {
  res.send("welcome to movieteka !");
});

/**
 * @route GET /movies
 * @group Movies - Operations related to movies.
 * @returns {Movie[]} 201 - An array of all movies.
 * @returns {Error} 500 - Internal server error.
 */
app.get("/movies", passport.authenticate("jwt", { session: false }), (req, res) => {  // 3 parameters: url, AuthZ, callback
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);   
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("error: " + err);
    });
});

/**
 * @route GET /movies/title/:title
 * @group Movies - Operations related to movies.
 * @param {string} title.path.required - The title of the movie to search for.
 * @returns {Movie} 201 - The movie with the specified title.
 * @returns {Error} 404 - Movie not found error.
 * @returns {Error} 500 - Internal server error.
 */
app.get("/movies/title/:title", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({title: req.params.title})
    .then((movies) => {
      if (!movies) {
        return res.status(404).send("error " + req.params.title + " not found :/");
      }
      res.status(201).json(movies);
    })
      .catch((err) => {
        console.error(err);
        res.status(500).send("error: " + err);
    });
});

/**
 * @route GET /movies/genre/:genre
 * @group Movies - Operations related to movies.
 * @param {string} genre.path.required - The genre of the movies to search for.
 * @returns {Movie[]} 201 - An array of movies with the specified genre.
 * @returns {Error} 404 - No movies found in the specified genre error.
 * @returns {Error} 500 - Internal server error.
 */

app.get("/movies/genre/:genre", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.find({"genre.name": req.params.genre})
    .then((movies) => {
      if (movies.length == 0) {
        return res.status(404).send("error: no movies found in the genre " + req.params.genre + " :/");
      }
      res.status(201).json(movies);
    })
      .catch((err) => {
        console.error(err);
        res.status(500).send("error: " + err);
    });
});

/**
 * @route GET /movies/director_description/:director
 * @group Movies - Operations related to movies.
 * @param {string} director.path.required - The name of the director to search for.
 * @returns {Movie} 201 - The movie directed by the specified director.
 * @returns {Error} 404 - Director not found error.
 * @returns {Error} 500 - Internal server error.
 */
app.get("/movies/director_description/:director", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({"director.name": req.params.director})
    .then((movies) => {
      if (!movies) {
        return res.status(404).send("error " + req.params.director + " not found :/");
      }
      res.status(201).json(movies);
    })
      .catch((err) => {
        console.error(err);
        res.status(500).send("error: " + err);
    });
});

/**
 * @route GET /movies/director/:director
 * @group Movies - Operations related to movies.
 * @param {string} director.path.required - The name of the director to search for.
 * @returns {Movie[]} 201 - An array of movies directed by the specified director.
 * @returns {Error} 404 - No movies found with the specified director error.
 * @returns {Error} 500 - Internal server error.
 */
app.get("/movies/director/:director", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.find({"director.name": req.params.director})
    .then((movies) => {
      if (movies.length == 0) {
        return res.status(404).send("error " + req.params.director + " not found :/");
      }
      res.status(201).json(movies);
    })
      .catch((err) => {
        console.error(err);
        res.status(500).send("error: " + err);
    });
});


/**
 * @route GET /users
 * @group Users - Operations related to users.
 * @returns {User[]} 200 - An array of all users (excluding password field).
 * @returns {Error} 500 - Internal server error.
 */
app.get("/users", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.find()
    .select("-password") // Exclude the password field from the response
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("error: " + error);
    });
});


/**
 * @route GET /users/:username/favMovies
 * @group Users - Operations related to users.
 * @param {string} username.path.required - The username of the user.
 * @returns {Movie[]} 200 - An array of favorite movies of the specified user.
 * @returns {Error} 404 - User not found error.
 * @returns {Error} 500 - Internal server error.
 */
app.get("/users/:username/favMovies", passport.authenticate("jwt", {session: false}), (req, res) => {
  Users.findOne({ username: req.params.username })
    .populate("favMovies") // Populate the referenced movies
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).send("error: user not found :/");
      } else {
        res.status(200).json(user.favMovies);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("error: " + error);
    });
});

/**
 * @route PUT /users/:username
 * @group Users - Operations related to users.
 * @param {string} username.path.required - The username of the user to update.
 * @param {User} request.body.required - The updated user information.
 * @returns {User} 200 - The updated user.
 * @returns {Error} 422 - Validation error.
 * @returns {Error} 404 - User not found error.
 * @returns {Error} 500 - Internal server error.
 */
app.put("/users/:username", passport.authenticate("jwt", { session: false }), (req, res) => {
  // Checking for errors:
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Generate new hashed password if the request includes a new password
  let hashedPassword;
  if (req.body.password) {
    hashedPassword = Users.hashPassword(req.body.password);
  }

/**
     * @typedef {Object} UpdateUserRequestBody
     * @property {string} username - The updated username of the user.
     * @property {string} email - The updated email address of the user.
     * @property {string} bday - The updated birthdate of the user.
     * @property {string} password - The updated password of the user.
     */

    /**
     * @typedef {Object} UpdateUserResponseBody
     * @property {string} username - The updated username of the user.
     * @property {string} email - The updated email address of the user.
     * @property {string} bday - The updated birthdate of the user.
     */
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        bday: req.body.bday,
        password: hashedPassword || req.user.password, // Use the new hashed password if provided, otherwise use the existing hashed password
      },
    },
    { new: true }
  )
    .select("-password") // Exclude the password field from the response
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send("error: user not found :/");
      } else {
        res.json(updatedUser);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("error: " + error);
    });
});


  // DELETE

/**
 * @route DELETE /users/:username/favMovies/:movieID
 * @group Users - Operations related to users.
 * @param {string} username.path.required - The username of the user.
 * @param {string} movieID.path.required - The ID of the movie to remove from favorites.
 * @returns {User} 200 - The updated user with the removed favorite movie.
 * @returns {Error} 404 - User not found error.
 * @returns {Error} 500 - Internal server error.
 */
// delete movie from favMovies:
app.delete("/users/:username/favMovies/:movieID", passport.authenticate("jwt", {session: false}), (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    { $pull: { favMovies: req.params.movieID } },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send("error: user not found :/");
      } else {
        res.json(updatedUser);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("error: " + error);
    });
});

/**
 * @route DELETE /users/:username
 * @group Users - Operations related to users.
 * @param {string} username.path.required - The username of the user to delete.
 * @returns {string} 200 - A success message indicating the user is deleted.
 * @returns {Error} 404 - User not found error.
 * @returns {Error} 500 - Internal server error.
 */
app.delete("/users/:username", passport.authenticate("jwt", {session: false}), (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + " not found");
      } else {
        res.status(200).send(req.params.username + " is deleted now");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("error: " + err);
    });
});
// ERROR HANDLING middleware - always last but before listen
  
  methodOverride = require("method-override");
  app.use(methodOverride());

  /**
 * @middleware
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function.
 */
  app.use("/documentation", express.static("public"));
  
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("something broke !!");
  });

/**
 * Start the server on the specified port.
 */
  const port = process.env.PORT || 5500;
  app.listen(port, '0.0.0.0',() => {
    console.log("Listening on Port " + port);
  });       // fire up for heroku