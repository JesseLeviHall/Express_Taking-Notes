const router = require("express").Router();
const UserModel = require("./model");
const bcrypt = require("bcryptjs");

router.post("/login", (req, res, next) => {
  res.send("Login");
});

router.post(
  "/register",
  userRegValidation,
  emailInUse,
  hashPassword,
  (req, res, next) => {
    console.log(req.body.password);
    const newUser = new UserModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });
    newUser
      .save()
      .then((document) => {
        if (document) {
          document.password = undefined;
          res.json(document);
        } else {
          res.send("unable to create user");
        }
      })
      .catch((err) => {
        console.log(err);
        res.send("there was an error");
      });
  }
);
router.get("/:id", (req, res, next) => {
  UserModel.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(400).send("user not found");
      } else {
        user.password = undefined;
        res.json(user);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("there was an error");
    });
});

function userRegValidation(req, res, next) {
  const { firstName, lastName, email, password } = req.body;
  const missingFileds = [];
  if (!firstName) {
    missingFileds.push("first name");
  }
  if (!lastName) {
    missingFileds.push("last name");
  }
  if (!email) {
    missingFileds.push("email");
  }
  if (!password) {
    missingFileds.push("password");
  }

  if (missingFileds.length) {
    res
      .status(400)
      .send(`we're missing something: ${missingFileds.join(", ")}`);
  } else {
    next();
  }
}

function emailInUse(req, res, next) {
  UserModel.findOne({ email: req.body.email })
    .then((email) => {
      if (email) {
        res.status(400).send(`${email} is already registered`);
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("there was an error");
    });
}

function hashPassword(req, res, next) {
  const { password } = req.body;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, passwordHash) {
      if (err) {
        res.status(500).send("there was an error");
      } else {
        req.body.password = passwordHash;
        next();
      }
    });
  });
}

module.exports = router;
