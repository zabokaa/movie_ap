//INTEGRATING mongoose w/ rest api
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect("mongodb://localhost:27017/cfDB", {
  useNewUrlParser: true, useUnifiedTopology: true
});


const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  uuid = require("uuid"),
  bodyParser = require("body-parser"),
  path = require("path");
  
const app = express();
// //will be used for routing requests a responses
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {flags: "a"});

// // middleware
app.use(bodyParser.json());
// app.use(morgan("combined", {stream: accessLogStream}));
// app.use(express.static("public"));

//blan k is %20
let movies = [
    {
        title: "Portrait of a Lady on Fire",
        description: "Set in France in the late 18th century, the film tells the story of an affair between an aristocrat and a painter commissioned to paint her portrait.",
        director: {
          name: "Céline Sciamma",
          bio: "Sciamma was born on 12 November 1978 and raised in Cergy-Pontoise, a suburb outside of Paris. Before attending La Fémis, the première French film school, where she studied from 2001-2005, Sciamma earned her master's degree in French Literature at Paris Nanterre University",
          gender: "female"
        },
        genre: "drama",
        year: 2019
    },
    {
        title: "Madalena",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin.",
        director: {
          name: "Madiano Marcheti",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "female"
        },
        genre: "drama",
        year: 2021
    },
    {
        title: "Mouthpiece",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin.",
        director: {
          name: "Patricia Rozema",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "female"
        },
        genre: "drama",
        year: 2017
    }, 
    {
        title: "Circumstance",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        director: {
          name: "Maryam Keshavarz",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "female"
        },
        genre: "drama",
        year: 2020
    },
    {
        title: "Rafiki",
        description: "Despite the political rivalry between their families, Kena and Ziki resist and remain close friends, supporting each other to pursue their dreams in a conservative society. When love blossoms between them, the two girls will be forced to choose between happiness and safety.",
        director: {
          name: "Wanuri Kahiu",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "female"
        },
        genre: "drama",
        year: 2018
    },
    {
        title: "Amour Fou",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        director: {
          name: "Jessica Hausner",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "female"
        },
        genre: "drama",
        year: 2021
    },
    {
        title: "Ghosts",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        director: {
          name: "Christian Petzold",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "male"
        },
        genre: "drama",
        year: 2005
    },
    {
        title: "Why Does Herr R. Run Amok?",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        director: {
          name: "Rainer Werner Fassbinder",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "male"
        },
        genre: "drama",
        year: 1980
    },
    {
        title: "Titane",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        director: {
          name: "Julia Ducournau",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "female"
        },
        genre: "thriller",
        year: 2020
    },
    {
        title: "20,000 Species of Bees",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        director: {
          name: "Estibaliz Urresola Solaguren",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "female"
        },
        genre: "drama",
        year: 2023
    }
  ];

  let users = [
    {
      id: 1,
      name: "Saba",
      favMovies: ["Rafiki", "20,000 Species of Bees", "Titane", "Portrait of a Lady on Fire"]
    },
    {
      id: 2,
      name: "Garima",
      favMovies: ["Mouthpiece","Ghosts", "Portrait of a Lady on Fire"]
    },
    {
      id: 3,
      name: "Krassi",
      favMovies: ["Why Does Herr R. Run Amok?", "Titane"]
    },
  ]
  
//   app.METHOD(PATH, HANDLER)

  // POST (create)
  app.post("/users", (req, res) => {
    const newUser = req.body;
    if (newUser.name) {
      newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).json(newUser);
    }
    else {
      res.status(400).send("enter new user name");
    }
  });

  app.post("/users/:id/:movieTitle", (req, res) => {
    const { id, movieTitle } = req.params;
    let user = users.find (user => user.id == id)
    if (user) {
      user.favMovies.push(movieTitle);
      res.status(200).send(`${movieTitle} has been added to ${id}'s list of favourite movies.`);
    }
    else {
      res.status(400).send("no such user");
    }
  });
  // GET req (read)

  app.get("/", (req, res) => {
    res.send("Welcome to our Movieteka");
  });
  
  app.get("/movies", (req, res) => {
    res.status(200).json(movies);
  });

  app.get("/movies/:title", (req, res) => {
    // const title = req.params.title;
    const { title } =req.params;
    const movie = movies.find(movie => movie.title === title);
      if (movie) {
        res.status(200).json(movie);
      } 
      else {
        res.status(400).send("movie not found");
      }
  });

  //GO DO: wanna display all movie titles by genre !!
  app.get("/movies/genre/:genreName", (req, res) => {
    const { genreName } =req.params;
    const movie = movies.find(movie => movie.genre === genreName);
      if (movie) {
        res.status(200).json(movie);
      } 
      else {
        res.status(400).send("no such genre found");
      }
  });

  app.get("/movies/director/:directorName", (req, res) => {
    const { directorName } =req.params;
    const director = movies.find(movie => movie.director.name === directorName).director;
      if (director) {
        res.status(200).json(director);
      } 
      else {
        res.status(400).send("director not found");
      }
  });



  // PUT (update)
  app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const updateUser = req.body;
    // hier nur 2 ==  string and number, sonst nicht equal 
    let user = users.find (user => user.id == id)
    if (user) {
      user.name = updateUser.name;
      res.status(200).json(user);
    }
    else {
      res.status(400).send("no such user");
    }
  });

  // DELETE
  app.delete("/users/:id/:movieTitle", (req, res) => {
    const { id, movieTitle } = req.params;
    let user = users.find (user => user.id == id)
    if (user) {
      user.favMovies = user.favMovies.filter(
        title => title !== movieTitle);
      res.status(200).send(`${movieTitle} has been removed from ${id}'s list of favourite movies.`);
    }
    else {
      res.status(400).send("no such user or favourite movie");
    }
  });

  app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    let user = users.find (user => user.id == id)

    if (user) {
      users = users.filter(user => user.id != id);
      res.status(200).send(`${id}'s email has been removed.`);
    }
    else {
      res.status(400).send("no such user");
    }
  });

// error handling middleware - always last but before listen
  
    methodOverride = require("method-override");

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