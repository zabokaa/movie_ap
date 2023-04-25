// const bodyParser = require("body-parser");
const app = require("express")();
  morgan = require("morgan");

  app.use(morgan("common"));
  // morgan = require("morgan");
    // fs = require("fs");
    // path = require("path");


// //will be used for routing requests a responses
// const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt", {flags: "a"}));

// // middleware
// app.use(morgan("combined", {stream: accessLogStream}));
// app.use(express.static("public"));
// app.use(morgan("common"));
// app.use(bodyParser.json());


let favMovies = [
    {
        title: "Portrait of a Lady on Fire",
        author: "'Céline Sciamma"
    },
    {
        title: "Madalena",
        author: "Madiano Marcheti"
    },
    {
        title: "Mouthpiece",
        author: "Patricai Rozema"
    },
    {
        title: "Circumstance",
        author: "Maryam Keshavarz"
    },
    {
        title: "Rafiki",
        author: "Wanuri Kahiu"
    },
    {
        title: "Amour Fou",
        author: "Jessica Hausner"
    },
    {
        title: "Ghosts",
        author: "Christian Petzold"
    },
    {
        title: "Why Does Herr R. Run Amok? ",
        author: "Rainer Werner Fassbinder"
    },
    {
        title: "Titane",
        author: "Julia Ducournau"
    },
    {
        title: "20,000 Species of Bees ",
        author: "Estibaliz Urresola Solaguren"
    }
  ];
  
//   app.METHOD(PATH, HANDLER)

  // GET req

  app.get("/", (req, res) => {
    res.send("Welcome to our Movieteka");
  });

  app.get("/documentation", (req, res) => {                  
    res.sendFile("public/documentation.html", { root: __dirname });
  });
  
  app.get("/movies", (req, res) => {
    res.json(favMovies);
  });
  
  //renamed secreturl --> blocked by addblocker
  app.get("/securl", (req, res) => {
    res.send("super secret content..jajaja");
  });

  // fire up the app
  app.listen(5500, () => {
    console.log("My app is listening on port 5500.");
  });