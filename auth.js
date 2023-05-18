// endpoint 4 log in registered users

const jwtSecret = "your_jwt_secreta";
const jwt = require("jsonwebtoken"),
    passport = require("passport");

require("./passport.js");

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.username,
        expiresIn: "7d",
        // combination of a hashing function and one (secret) key 
        //that is shared between the two parties used to generate the hash that will serve as the signature:
        algorithm: "HS256"
    });
}

//POST req log in :
module.exports = (router) => {
    router.post("/login", (req, res) => {
      passport.authenticate("local", { session: false }, (error, user, info) => {
        if (error || !user) {
          return res.status(400).json({
            message: "Something's out of whack",
            user: user
          });
        }
        req.login(user, { session: false }, (error) => {
          if (error) {
            res.send(error);
          }
          let token = generateJWTToken(user.toJSON());
          return res.json({ user, token });
        });
      })(req, res);
    });
  }