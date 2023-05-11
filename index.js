const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  uuid = require("uuid"),
  bodyParser = require("body-parser"),
  path = require("path");
//INTEGRATING mongoose w/ rest api
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect("mongodb://127.0.0.1:27017/cfDB", {
  useNewUrlParser: true, useUnifiedTopology: true
});
  
const app = express();

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//will be used for routing requests a responses
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {flags: "a"});


  // POST (create)

// create a new user profile

  app.post("/users", (req, res) => {
    Users.findOne({username: req.body.username})
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.username + "already exists");
        } else {
          Users.create({
              username: req.body.username,
              password: req.body.password,
              email: req.body.email,
              bday: req.body.bday
            })
            .then((user) => {res.status(201).json(user)})
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("error: " + error);
      });
  });



  // GET req (read)

 

  


  // PUT (update)


  // DELETE


// error handling middleware - always last but before listen
  
    methodOverride = require("method-override");
npm 
  app.use(bodyParser.urlencoded({
  extended: true
  }));

  app.use(bodyParser.json());
  app.use(methodOverride());

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("something broke !!");
  });

  // fire up the app
  app.listen(5500, () => {
    console.log("My app is listening on port 5500.");
  });