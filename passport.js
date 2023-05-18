const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Models = require("./models.js");
const passportJWT = require("passport-jwt");

const Users = Models.Users;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJWT;

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, callback) => {
      console.log(username + " " + password);
      Users.findOne({ username: username }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }

        if (!user) {
          console.log("username incorrect");
          return callback(null, false, {
            message: "username or password are not correct :/",
          });
        }

        console.log("finished");
        return callback(null, user);
      });
    }
  )
);

passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: "your_jwt_secreto",
      },
      (jwtPayload, callback) => {
        return Users.findById(jwtPayload._id)
          .then((user) => {
            return callback(null, user);
          })
          .catch((error) => {
            return callback(error);
          });
      }
    )
  );
  
