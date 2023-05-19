const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Models = require("./models.js");
const passportJWT = require("passport-jwt");

const Users = Models.User;
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");


passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, callback) => {
      console.log(username + " " + password);

      Users.findOne({ username: username })
        .then((user) => {
          if (!user) {
            console.log("username incorrect");
            return callback(null, false, {
              message: "username or password are not correct :/",
            });
          }

          console.log("finished");
          return callback(null, user);
        }).catch((error) => {
          console.log(error);
          return callback(error);
        })
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
      secretOrKey: "your_jwt_secreta",
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
