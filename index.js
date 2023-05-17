const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const bodyParser = require("body-parser");
//to allow cross-origin requests e.g. from Insomnia:
const cors = require("cors");

//INTEGRATING mongoose w/ rest api
const app = express();

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

//CONNECTING + CHECKING to self-hosted mongoDB
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
 
  // PUT (update)
// updating user data:
app.put("/users/:username", (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $set: {
        username: req.body.username,
        bday: req.body.birthday,
        password: req.body.password,
        email: req.body.email,
      },
    },
    { new: true }
  )
    .then((user) => {
      if (user === null) {
        return res.status(404).send("error: user not found :/");
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('error: ' + err);
    });
});


// adding new movie to favMovies:

  // DELETE
// delete movie from favMovies:

// delete user:

// ERROR HANDLING middleware - always last but before listen
  
  //   methodOverride = require("method-override");

  // app.use(bodyParser.urlencoded({
  // extended: true
  // }));

  // app.use(bodyParser.json());
  // app.use(methodOverride());
  app.use("/documentation", express.static("public"));
  
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("something broke !!");
  });

  // fire up the app
  app.listen(5501, () => {
    console.log("My app is listening on port 5501.");
  });