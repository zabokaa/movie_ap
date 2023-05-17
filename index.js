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
const Genres = Models.Genre;
const Directors = Models.Director;

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

// create a new user profile

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
          res.status(500).send("Error: " + error);
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
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
      res.status(500).send("Error: " + err);
    });
}
  );
 

  


  // PUT (update)


  // DELETE


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