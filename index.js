const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const bodyParser = require("body-parser");
//to allow cross-origin requests:
const cors = require("cors");

//INTEGRATING mongoose w/ rest api
const app = express();

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

//CONNECTING + CHECKING conne to self-hosted mongoDB
mongoose.connect("mongodb://localhost:27017/cfDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Error connecting to MongoDB", error);
});


// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());   //enables CORS for all routes
//will be used for routing requests a responses:
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {flags: "a"});
app.use(morgan("combined", { stream: accessLogStream }));

  // POST (create)

// create a new user profile:
app.post("/users", (req, res) => {
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + " already exists");
      } else {
        Users.create({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          bday: req.body.bday
        })
        .then((user) => {
          res.status(201).json(user);
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

//adding new movie to favMovies:
app.post("/users/:username/movies/:movieID", (req, res) => {
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

  // GET req (read) 
//testing:
app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

// list of all movies:
app.get("/movies", (req,res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("error: " + err);
    });
});

// 1 movie by title:
app.get("/movies/title/:title", (req, res) => {
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

// list of movies by genre:
app.get("/movies/genre/:genre", (req, res) => {
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

// data about 1 director by name:
app.get("/movies/director_description/:director", (req, res) => {
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

// movies by director:
app.get("/movies/director/:director", (req, res) => {
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
// list of all users:
app.get("/users", (req,res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("error: " + err);
    });
});

// favMovies of 1 user:
app.get("/users/:username/favMovies", (req, res) => {
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
  // PUT (update)
// updating user data:
app.put("/users/:username", (req, res) => {
  Users.findOneAndUpdate({ username: req.params.username }, {
    $set: {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      bday: req.body.bday
    }
  }, { new: true })
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

  // DELETE
// delete movie from favMovies:
app.delete("/users/:username/movies/:movieID", (req, res) => {
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

// delete user:
app.delete("/users/:username", (req, res) => {
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

  app.use("/documentation", express.static("public"));
  
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("something broke !!");
  });

  // fire up the app
  app.listen(5501, () => {
    console.log("My app is listening on port 5501.");
  });