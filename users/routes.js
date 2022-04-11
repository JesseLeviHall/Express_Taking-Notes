const router = require("express").Router();
const UserModel = require("./model");
const bcrypt = require("bcryptjs");
const Chance = require("chance");
const chance = new Chance();

router.post(
  "/login",
  loginInputValidation,
  findUser,
  checkPassword,
  giveAccess,
  (req, res, next) => {}
);

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

function loginInputValidation(req, res, next) {
  const { email, password } = req.body;
  const missingFileds = [];
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

function findUser(req, res, next) {
  const { email } = req.body;
  UserModel.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(400).send(`${email} is not a registered email`);
      } else {
        req.user = user;
        next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("there was an error");
    });
}

function checkPassword(req, res, next) {
  const hashPassword = req.user.password;
  const { password } = req.body;
  bcrypt.compare(password, hashPassword, function (err, passwordCorrect) {
    if (err) {
      console.log(err);
      res.status(500).send("there was an error");
    } else {
      if (passwordCorrect) {
        next();
      } else {
        res.status(400).send("password incorrect");
      }
    }
  });
}

function giveAccess(req, res, next) {
  const accessToken = chance.guid();
  req.user.accessToken = accessToken;
  req.user
    .save()
    .then((result) => {
      if (result) {
        res.send(accessToken);
      } else {
        res.status(400).send("there was an error");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("there was an error");
    });
}

module.exports = router;
