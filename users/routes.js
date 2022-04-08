const router = require("express").Router();

router.post("/login", (req, res, next) => {
  res.send("Login");
});

router.post("/register", (req, res, next) => {
  res.send("Register User");
});

module.exports = router;
