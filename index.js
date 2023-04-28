// first: acivating nodemon in zsh: `npm run dev` !!

// const app = require("express")();
// the combined one not working when I want to use express.static .. arrg

const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  uuid = require("uuid"),
  path = require("path");
const app = express();
// //will be used for routing requests a responses
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {flags: "a"});

// // middleware
app.use(bodyParser.json());
app.use(morgan("combined", {stream: accessLogStream}));
app.use(express.static("public"));


let movies = [
    {
        title: "Portrait of a Lady on Fire",
        description: "Set in France in the late 18th century, the film tells the story of an affair between an aristocrat and a painter commissioned to paint her portrait." 
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
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin."
        director: {
          name: "Madiano Marcheti",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "female"
        }
        genre: "drama",
        year: 2021
    },
    {
        title: "Mouthpiece",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin."
        director: {
          name: "Patricia Rozema",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "female"
        }
        genre: "drama",
        year: 2017
    }, 
    {
        title: "Circumstance",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        director: {
          name: "Maryam Keshavarz",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "female"
        }
        genre: "drama",
        year: 2020
    },
    {
        title: "Rafiki",
        description: "Despite the political rivalry between their families, Kena and Ziki resist and remain close friends, supporting each other to pursue their dreams in a conservative society. When love blossoms between them, the two girls will be forced to choose between happiness and safety."
        director: {
          name: "Wanuri Kahiu",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "female"
        }
        genre: "drama",
        year: 2018
    },
    {
        title: "Amour Fou",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        director: {
          name: "Jessica Hausner",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "female"
        }
        genre: "drama",
        year: 2021
    },
    {
        title: "Ghosts",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        director: {
          name: "Christian Petzold",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "male"
        }
        genre: "drama",
        year: 2005
    },
    {
        title: "Why Does Herr R. Run Amok?",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        director: {
          name: "Rainer Werner Fassbinder",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "male"
        }
        genre: "drama",
        year: 1980
    },
    {
        title: "Titane",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        director: {
          name: "Julia Ducournau",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "female"
        }
        genre: "thriller",
        year: 2020
    },
    {
        title: "20,000 Species of Bees",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        director: {
          name: "Estibaliz Urresola Solaguren",
          bio: "Duis tristique sollicitudin nibh sit amet. Interdum posuere lorem ipsum dolor sit amet consectetur.",
          gender: "female"
        }
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
// URL and sub-URLs endpoints: /users AND /users/[ID] AND /users[ID]/fav etc.

  // POST (create)

  // GET req (read)

  app.get("/", (req, res) => {
    res.send("Welcome to our Movieteka");
  });
  
  app.get("/movies", (req, res) => {
    res.json(movies);
  });




  // PUT (update)

  // DELETE


// error handling middleware - always last but before listen
  const bodyParser = require("body-parser"),
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