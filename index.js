const express = require("express");
const app = express(); //will be used for routing requests a responses

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
  
  // GET requests
  app.get("/", (req, res) => {
    res.send("Welcome to our movieteka");
  });
  
  app.get("/documentation", (req, res) => {                  
    res.sendFile("public/documentation.html", { root: __dirname });
  });
  
  app.get("/movies", (req, res) => {
    res.json(favMovies);
  });
  
  
  // LISTEN for requests
  app.listen(5500, () => {
    console.log("My app is listening on port 5500.");
  });