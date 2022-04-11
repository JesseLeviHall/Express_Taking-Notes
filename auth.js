const passport = require("passport");
const BearerStrategy = require("passport-http-bearer");
const UserModel = require("./users/model");

passport.use(
  new BearerStrategy(function (accessToken, done) {
    UserModel.findOne({ accessToken })
      .then((foundUser) => {
        if (foundUser) {
          return done(null, foundUser);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => {
        done(err);
      });
  })
);

module.exports = passport;
